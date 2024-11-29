require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enhanced Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// MongoDB Schema with timestamps
const tournamentSchema = new mongoose.Schema({
    pointsTable: {
        type: Map,
        of: {
            matchesPlayed: Number,
            wins: Number,
            losses: Number,
            points: Number,
            color: String
        },
        required: true
    },
    completedMatches: {
        type: [Number],
        default: []
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true,
    versionKey: false 
});

// Add index for better query performance
tournamentSchema.index({ lastUpdated: -1 });

const Tournament = mongoose.model('Tournament', tournamentSchema);

// Cache for tournament data
let tournamentCache = {
    data: null,
    lastUpdated: null
};

// Cache middleware
const checkCache = (req, res, next) => {
    if (tournamentCache.data && 
        (new Date() - tournamentCache.lastUpdated) < 30000) { // 30 seconds cache
        return res.json(tournamentCache.data);
    }
    next();
};

// Routes with improved error handling
app.get('/api/tournament', checkCache, async (req, res) => {
    try {
        let tournament = await Tournament.findOne().lean();
        
        if (!tournament) {
            tournament = new Tournament({
                pointsTable: {},
                completedMatches: []
            });
            await tournament.save();
        }
        
        // Update cache
        tournamentCache.data = tournament;
        tournamentCache.lastUpdated = new Date();
        
        res.json(tournament);
    } catch (error) {
        console.error('Error fetching tournament:', error);
        res.status(500).json({ 
            error: 'Failed to fetch tournament data',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

app.post('/api/tournament/update', async (req, res) => {
    try {
        const { pointsTable, completedMatches } = req.body;
        
        if (!pointsTable || typeof pointsTable !== 'object') {
            return res.status(400).json({ error: 'Invalid points table data' });
        }

        const tournament = await Tournament.findOneAndUpdate(
            {},
            {
                $set: {
                    pointsTable,
                    completedMatches: completedMatches || [],
                    lastUpdated: new Date()
                }
            },
            { 
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        // Clear cache
        tournamentCache.data = null;
        
        res.json({ 
            message: 'Tournament updated successfully',
            tournament 
        });
    } catch (error) {
        console.error('Error updating tournament:', error);
        res.status(500).json({ 
            error: 'Failed to update tournament',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

app.post('/api/tournament/reset', async (req, res) => {
    try {
        const tournament = await Tournament.findOneAndUpdate(
            {},
            {
                $set: {
                    pointsTable: {},
                    completedMatches: [],
                    lastUpdated: new Date()
                }
            },
            { 
                new: true,
                upsert: true
            }
        );

        // Clear cache
        tournamentCache.data = null;
        
        res.json({ 
            message: 'Tournament reset successfully',
            tournament 
        });
    } catch (error) {
        console.error('Error resetting tournament:', error);
        res.status(500).json({ 
            error: 'Failed to reset tournament',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Improved MongoDB connection with retry logic
const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-mongodb-uri';
    
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

// Handle MongoDB connection errors
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    connectDB();
});

// Start server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer().catch(console.error);
