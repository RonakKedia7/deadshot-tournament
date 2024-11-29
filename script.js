// Prize Pool Configuration
const PRIZE_POOL = {
    first: {
        amount: 250,
        currency: "₹",
        label: "1st Place"
    },
    second: {
        amount: 125,
        currency: "₹",
        label: "2nd Place"
    },
    third: {
        amount: 75,
        currency: "₹",
        label: "3rd Place"
    }
};

const formatCurrency = (amount, currency = "₹") => {
    return `${currency}${amount.toLocaleString('en-IN')}`;
};

const teams = [
    { 
        name: "Team Alpha", 
        color: "#FF6B6B",  // Coral Red
        secondaryColor: "#ff8585", 
        players: ["Anash", "Ayush"] 
    },
    { 
        name: "Team Beta", 
        color: "#00B894",  // Mint Green
        secondaryColor: "#1dd1ab", 
        players: ["Gaurav", "Suyesh"] 
    },
    { 
        name: "Team Gamma", 
        color: "#FFD93D",  // Golden Yellow
        secondaryColor: "#ffe265", 
        players: ["Mayank", "Yash"] 
    },
    { 
        name: "Team Delta", 
        color: "#6C5CE7",  // Purple
        secondaryColor: "#8a7dff", 
        players: ["Sachin", "Sujal"] 
    },
    { 
        name: "Team Epsilon", 
        color: "#45B7D1",  // Sky Blue
        secondaryColor: "#63c9e0", 
        players: ["KrishR", "Soyeb"] 
    },
    { 
        name: "Team Zeta", 
        color: "#E84393",  // Hot Pink
        secondaryColor: "#f164aa", 
        players: ["Ronak", "Raushan"] 
    }
];

const pointsTable = {};
teams.forEach(team => {
    pointsTable[team.name] = {
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        points: 0,
        kills: 0,
        color: team.color
    };
});

const fixturesList = document.getElementById("fixtures-list");

const generateFixtures = () => {
    const fixtures = [];
    let startTime = new Date("2024-11-30T19:00:00");
    let matchNumber = 1;

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            const match = {
                team1: teams[i].name,
                team2: teams[j].name,
                date: startTime.toLocaleDateString(),
                time: startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                matchNumber: matchNumber
            };
            fixtures.push(match);
            startTime.setMinutes(startTime.getMinutes() + 8);
            matchNumber++;
        }
    }
    return fixtures;
};

const getTeamColorClass = (color, name) => {
    // Map hex colors to CSS class names
    const colorMap = {
        '#FF6B6B': 'red',     // Team Alpha (Coral Red)
        '#00B894': 'green',   // Team Beta (Mint Green)
        '#FFD93D': 'yellow',  // Team Gamma (Golden Yellow)
        '#6C5CE7': 'purple',  // Team Delta (Purple)
        '#45B7D1': 'blue',    // Team Epsilon (Sky Blue)
        '#E84393': 'pink',    // Team Zeta (Hot Pink)
    };

    // Map team names directly if color mapping fails
    const teamNameMap = {
        'Team Alpha': 'red',
        'Team Beta': 'green',
        'Team Gamma': 'yellow',
        'Team Delta': 'purple',
        'Team Epsilon': 'blue',
        'Team Zeta': 'pink'
    };

    return colorMap[color] || teamNameMap[name] || 'blue';
};

const renderPointsTable = () => {
    const tableBody = document.getElementById("points-table-body");
    tableBody.innerHTML = '';

    // Convert points table to array and sort by points
    const sortedTeams = teams.map(team => ({
        name: team.name,
        ...pointsTable[team.name],
        color: team.color,
        colorClass: getTeamColorClass(team.color, team.name)
    })).sort((a, b) => {
        // Sort by points first
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        // If points are equal, sort by wins
        if (b.wins !== a.wins) {
            return b.wins - a.wins;
        }
        // If wins are equal, sort alphabetically
        return a.name.localeCompare(b.name);
    });

    sortedTeams.forEach(team => {
        const row = document.createElement('tr');
        row.className = `team-${team.colorClass}`;
        
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.matchesPlayed || 0}</td>
            <td>${team.wins || 0}</td>
            <td>${team.losses || 0}</td>
            <td class="points-cell">${team.points || 0}</td>
        `;
        
        tableBody.appendChild(row);
    });
};

const renderPrizePool = () => {
    const prizesContainer = document.querySelector('.prizes');
    prizesContainer.innerHTML = '';

    const prizeClasses = {
        first: 'gold',
        second: 'silver',
        third: 'bronze'
    };

    const prizeIcons = {
        first: 'trophy',
        second: 'medal',
        third: 'award'
    };

    Object.entries(PRIZE_POOL).forEach(([key, prize]) => {
        const prizeElement = document.createElement('div');
        prizeElement.className = `prize ${prizeClasses[key]}`;
        
        prizeElement.innerHTML = `
            <i class="fas fa-${prizeIcons[key]}"></i>
            <span class="place">${prize.label}</span>
            <span class="amount">${formatCurrency(prize.amount, prize.currency)}</span>
        `;
        
        prizesContainer.appendChild(prizeElement);
    });
};

const renderFixtures = () => {
    const fixtures = generateFixtures();
    fixturesList.innerHTML = '';
    fixtures.forEach((match, index) => {
        const team1Data = teams.find(t => t.name === match.team1);
        const team2Data = teams.find(t => t.name === match.team2);
        const isCompleted = completedMatches.includes(index);
        
        const listItem = `
            <li class="fixture-card ${isCompleted ? 'completed' : ''}" ${isCompleted ? 'style="position: relative;"' : ''}>
                <div class="fixture-header">
                    <i class="fas fa-gamepad"></i>
                    <span class="match-number">Match ${match.matchNumber}</span>
                </div>
                <div class="teams">
                    <div class="team team1" style="background: linear-gradient(145deg, ${team1Data.color}11, ${team1Data.color}22); border-left: 3px solid ${team1Data.color}">
                        <i class="fas fa-user-friends" style="color: ${team1Data.color}"></i>
                        <span style="color: ${team1Data.color}">${match.team1}</span>
                    </div>
                    <div class="vs">
                        <i class="fas fa-bolt"></i>
                        <span>VS</span>
                    </div>
                    <div class="team team2" style="background: linear-gradient(145deg, ${team2Data.color}11, ${team2Data.color}22); border-left: 3px solid ${team2Data.color}">
                        <i class="fas fa-user-friends" style="color: ${team2Data.color}"></i>
                        <span style="color: ${team2Data.color}">${match.team2}</span>
                    </div>
                </div>
                <div class="fixture-footer">
                    <i class="far fa-calendar-alt"></i>
                    <span class="date">${match.date} ${match.time}</span>
                </div>
            </li>
        `;
        fixturesList.innerHTML += listItem;
    });
};

const renderPlayers = () => {
    const playersList = document.getElementById("players-list");
    teams.forEach(team => {
        const teamCard = `
            <div class="team-card" style="border-color: ${team.color}">
                <div class="team-header" style="background: linear-gradient(145deg, ${team.color}22, ${team.color}44)">
                    <i class="fas fa-users" style="color: ${team.color}"></i>
                    <span class="team-name" style="color: ${team.color}">${team.name}</span>
                </div>
                <div class="players-list">
                    ${team.players.map(player => `
                        <div class="player" style="border-left: 3px solid ${team.color}">
                            <i class="fas fa-user" style="color: ${team.color}"></i>
                            <span>${player}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        playersList.innerHTML += teamCard;
    });
};

// API Configuration
const API_URL = 'https://deadshot-tournament.onrender.com/api'; // Your Render.com backend URL

// Data Management Functions
const initializeData = async () => {
    try {
        const response = await fetch(`${API_URL}/tournament`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch tournament data');
        }

        const data = await response.json();
        
        if (data.pointsTable) {
            Object.assign(pointsTable, data.pointsTable);
        }
        if (data.completedMatches) {
            completedMatches = data.completedMatches;
        }
    } catch (error) {
        console.error('Error loading tournament data:', error);
        // Use localStorage as fallback
        const savedData = localStorage.getItem('tournamentData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.pointsTable) {
                    Object.assign(pointsTable, data.pointsTable);
                }
                if (data.completedMatches) {
                    completedMatches = data.completedMatches;
                }
            } catch (e) {
                console.error('Error loading from localStorage:', e);
            }
        }
    }
    
    // Always render UI components
    renderPointsTable();
    renderFixtures();
};

const saveData = async () => {
    const data = {
        pointsTable,
        completedMatches
    };

    try {
        // Save to API
        const response = await fetch(`${API_URL}/tournament/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save tournament data');
        }

        // Also save to localStorage as backup
        localStorage.setItem('tournamentData', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to API:', error);
        // Save to localStorage as fallback
        try {
            localStorage.setItem('tournamentData', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            showNotification('Failed to save changes. Please try again.', 'error');
        }
    }
};

// Admin Configuration
const ADMIN_PASSWORD = "ronakkedia7";
let isAdminLoggedIn = false;

// Admin Modal Handling
const adminModal = document.getElementById('adminModal');
const updateMatchModal = document.getElementById('updateMatchModal');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const loginSubmit = document.getElementById('loginSubmit');
const matchSelect = document.getElementById('matchSelect');
const winnerSelect = document.getElementById('winnerSelect');
const updateMatchBtn = document.getElementById('updateMatch');
let completedMatches = [];

// Close modal when clicking on X or outside
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        adminModal.style.display = "none";
        updateMatchModal.style.display = "none";
    }
});

window.onclick = function(event) {
    if (event.target === adminModal || event.target === updateMatchModal) {
        adminModal.style.display = "none";
        updateMatchModal.style.display = "none";
    }
}

// Admin Login Button Click
adminLoginBtn.onclick = () => {
    adminModal.style.display = "block";
};

// Login Submit
loginSubmit.onclick = () => {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        adminModal.style.display = "none";
        updateMatchModal.style.display = "block";
        document.getElementById('resetTournament').style.display = isAdminLoggedIn ? "block" : "none";
        // Clear password field
        document.getElementById('adminPassword').value = '';
        populateMatchSelect();
    } else {
        alert('Incorrect password!');
    }
};

// Populate Match Select
const populateMatchSelect = () => {
    const fixtures = generateFixtures();
    matchSelect.innerHTML = '<option value="">Select Match</option>';
    fixtures.forEach((match, index) => {
        if (!completedMatches.includes(index)) {
            matchSelect.innerHTML += `
                <option value="${index}">Match ${match.matchNumber}: ${match.team1} vs ${match.team2}</option>
            `;
        }
    });
};

// Update Winner Select based on Match Selection
matchSelect.onchange = () => {
    const matchIndex = parseInt(matchSelect.value);
    if (matchIndex >= 0) {
        const match = generateFixtures()[matchIndex];
        winnerSelect.innerHTML = `
            <option value="">Select Winner</option>
            <option value="${match.team1}">${match.team1}</option>
            <option value="${match.team2}">${match.team2}</option>
        `;
    } else {
        winnerSelect.innerHTML = '<option value="">Select Winner</option>';
    }
};

// Update Match Result
updateMatchBtn.onclick = () => {
    const matchIndex = parseInt(matchSelect.value);
    const winner = winnerSelect.value;

    if (matchIndex >= 0 && winner) {
        const match = generateFixtures()[matchIndex];
        const loser = winner === match.team1 ? match.team2 : match.team1;

        // Update points
        pointsTable[winner].matchesPlayed++;
        pointsTable[winner].wins++;
        pointsTable[winner].points += 2;
        pointsTable[loser].matchesPlayed++;
        pointsTable[loser].losses++;

        // Mark match as completed
        completedMatches.push(matchIndex);

        // Save to API
        saveData();

        // Update UI
        renderPointsTable();
        renderFixtures();
        
        // Reset and close modal
        updateMatchModal.style.display = "none";
        matchSelect.value = "";
        winnerSelect.innerHTML = '<option value="">Select Winner</option>';
    } else {
        alert("Please select both match and winner!");
    }
};

// Reset Tournament
const resetTournament = async () => {
    if (!isAdminLoggedIn) {
        alert("Admin access required!");
        return;
    }

    if (confirm('Are you sure you want to reset the tournament? This will clear all match results and points.')) {
        try {
            const response = await fetch(`${API_URL}/tournament/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reset tournament');
            }

            // Reset points table
            teams.forEach(team => {
                pointsTable[team.name] = {
                    matchesPlayed: 0,
                    wins: 0,
                    losses: 0,
                    points: 0,
                    color: team.color
                };
            });

            // Reset fixtures
            const fixtureCards = document.querySelectorAll('.fixture-card');
            fixtureCards.forEach(card => {
                card.classList.remove('completed');
            });

            // Reset completed matches
            completedMatches = [];

            // Update UI
            renderPointsTable();
            renderFixtures();
        } catch (error) {
            console.error('Error resetting tournament:', error);
            alert('Failed to reset tournament. Please try again.');
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    
    // Call render functions
    renderPrizePool();
    renderPointsTable();
    renderFixtures();
    renderPlayers();

    // Hide reset tournament button initially
    document.getElementById('resetTournament').style.display = "none";
    
    // Add event listener for reset tournament button
    document.getElementById('resetTournament').addEventListener('click', resetTournament);
    
    // Update total matches and players count
    document.getElementById('totalMatches').textContent = `${generateFixtures().length} Matches`;
    document.getElementById('totalPlayers').textContent = `${teams.reduce((acc, team) => acc + team.players.length, 0)} Players`;
});