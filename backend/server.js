require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema
const tournamentSchema = new mongoose.Schema({
    pointsTable: {
        type: Map,
        of: {
            matchesPlayed: Number,
            wins: Number,
            losses: Number,
            points: Number,
            color: String
        }
    },
    completedMatches: [Number],
    lastUpdated: { type: Date, default: Date.now }
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

// Routes
app.get('/api/tournament', async (req, res) => {
    try {
        let tournament = await Tournament.findOne();
        if (!tournament) {
            // Initialize with default data if no tournament exists
            tournament = new Tournament({
                pointsTable: {},
                completedMatches: []
            });
            await tournament.save();
        }
        res.json(tournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/tournament/update', async (req, res) => {
    try {
        const { pointsTable, completedMatches } = req.body;
        const tournament = await Tournament.findOne();
        
        if (tournament) {
            tournament.pointsTable = pointsTable;
            tournament.completedMatches = completedMatches;
            tournament.lastUpdated = new Date();
            await tournament.save();
        } else {
            await Tournament.create({
                pointsTable,
                completedMatches
            });
        }
        
        res.json({ message: 'Tournament updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/tournament/reset', async (req, res) => {
    try {
        await Tournament.findOneAndUpdate({}, {
            pointsTable: {},
            completedMatches: [],
            lastUpdated: new Date()
        }, { upsert: true });
        
        res.json({ message: 'Tournament reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-mongodb-uri';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ronakkedia7';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority',
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
