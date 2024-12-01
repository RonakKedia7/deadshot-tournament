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

// Initialize points table with default values
const pointsTable = {};
teams.forEach(team => {
    pointsTable[team.name] = {
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        kills: 0,
        points: 0,
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

// Function to render points table
function renderPointsTable() {
    const pointsTableBody = document.getElementById("points-table-body");
    pointsTableBody.innerHTML = "";

    const sortedTeams = Object.entries(pointsTable).sort((a, b) => {
        const teamA = a[1];
        const teamB = b[1];
        if (teamB.points !== teamA.points) {
            return teamB.points - teamA.points;
        }
        if (teamB.kills !== teamA.kills) {
            return teamB.kills - teamA.kills;
        }
        return a[0].localeCompare(b[0]);
    });

    sortedTeams.forEach(([teamName, stats]) => {
        const row = document.createElement('tr');
        const teamData = teams.find(t => t.name === teamName);
        row.className = `team-${getTeamColorClass(teamData.color, teamName)}`;
        
        row.innerHTML = `
            <td>${teamName}</td>
            <td>${stats.matchesPlayed || 0}</td>
            <td>${stats.wins || 0}</td>
            <td>${stats.draws || 0}</td>
            <td>${stats.losses || 0}</td>
            <td>${stats.kills || 0}</td>
            <td class="points-cell">${stats.points || 0}</td>
        `;
        
        pointsTableBody.appendChild(row);
    });
}

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
        
        // Get match result for completed matches
        let matchResult = null;
        if (isCompleted) {
            const team1Stats = pointsTable[match.team1];
            const team2Stats = pointsTable[match.team2];
            
            if (team1Stats.draws > team2Stats.draws) {
                matchResult = 'draw';
            } else {
                // Compare wins to determine the winner
                const team1Wins = team1Stats.wins;
                const team2Wins = team2Stats.wins;
                
                if (team1Wins > team2Wins) {
                    matchResult = match.team1;
                } else if (team2Wins > team1Wins) {
                    matchResult = match.team2;
                } else {
                    // If wins are equal, it must be a draw
                    matchResult = 'draw';
                }
            }
        }
        
        const listItem = `
            <li class="fixture-card ${isCompleted ? 'completed' : ''}" ${isCompleted ? 'style="position: relative;"' : ''}>
                <div class="fixture-header">
                    <i class="fas fa-gamepad"></i>
                    <span class="match-number">Match ${match.matchNumber}</span>
                </div>
                <div class="teams">
                    <div class="team team1" style="background: linear-gradient(145deg, ${team1Data.color}11, ${team1Data.color}22); border-left: 3px solid ${team1Data.color}">
                        <div class="team-container">
                            <div class="team-info">
                                <i class="fas fa-user-friends" style="color: ${team1Data.color}"></i>
                                <span style="color: ${team1Data.color}">${match.team1}</span>
                            </div>
                            ${isCompleted ? `
                                <span class="team-status ${
                                    matchResult === match.team1 ? 'status-won' : 
                                    matchResult === 'draw' ? 'status-draw' : 'status-lost'
                                }">
                                    ${matchResult === match.team1 ? 'Won' : 
                                      matchResult === 'draw' ? 'Draw' : 'Lost'}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="vs">
                        <i class="fas fa-bolt"></i>
                        <span>VS</span>
                    </div>
                    <div class="team team2" style="background: linear-gradient(145deg, ${team2Data.color}11, ${team2Data.color}22); border-left: 3px solid ${team2Data.color}">
                        <div class="team-container">
                            <div class="team-info">
                                <i class="fas fa-user-friends" style="color: ${team2Data.color}"></i>
                                <span style="color: ${team2Data.color}">${match.team2}</span>
                            </div>
                            ${isCompleted ? `
                                <span class="team-status ${
                                    matchResult === match.team2 ? 'status-won' : 
                                    matchResult === 'draw' ? 'status-draw' : 'status-lost'
                                }">
                                    ${matchResult === match.team2 ? 'Won' : 
                                      matchResult === 'draw' ? 'Draw' : 'Lost'}
                                </span>
                            ` : ''}
                        </div>
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
async function saveData() {
    try {
        const response = await fetch(`${API_URL}/tournament/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pointsTable,
                completedMatches
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save tournament data');
        }
    } catch (error) {
        console.error('Error saving tournament data:', error);
        alert('Failed to save tournament data. Please try again.');
    }
}

async function initializeData() {
    try {
        const response = await fetch(`${API_URL}/tournament`);
        if (!response.ok) {
            throw new Error('Failed to fetch tournament data');
        }

        const data = await response.json();
        
        // Initialize points table with default values if empty
        if (Object.keys(data.pointsTable || {}).length === 0) {
            teams.forEach(team => {
                pointsTable[team.name] = {
                    matchesPlayed: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    kills: 0,
                    points: 0,
                    color: team.color
                };
            });
        } else {
            // Make sure all teams have all required properties
            Object.entries(data.pointsTable).forEach(([teamName, stats]) => {
                pointsTable[teamName] = {
                    matchesPlayed: stats.matchesPlayed || 0,
                    wins: stats.wins || 0,
                    draws: stats.draws || 0,
                    losses: stats.losses || 0,
                    kills: stats.kills || 0,
                    points: stats.points || 0,
                    color: stats.color || teams.find(t => t.name === teamName).color
                };
            });
        }

        completedMatches = data.completedMatches || [];
        
        renderPointsTable();
        renderFixtures();
    } catch (error) {
        console.error('Error initializing tournament data:', error);
    }
}

// Reset tournament function
function resetTournament() {
    if (confirm("Are you sure you want to reset the tournament? This action cannot be undone.")) {
        // Reset points table with proper initialization
        teams.forEach(team => {
            pointsTable[team.name] = {
                matchesPlayed: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                kills: 0,
                points: 0,
                color: team.color
            };
        });

        // Reset completed matches
        completedMatches = [];

        // Save the reset data
        saveData();

        // Update UI
        renderPointsTable();
        renderFixtures();
    }
};

// Admin Configuration
const ADMIN_PASSWORD = "ronakkedia7";
let isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

// Admin Modal Handling
const adminModal = document.getElementById('adminModal');
const updateMatchModal = document.getElementById('updateMatchModal');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const loginSubmit = document.getElementById('loginSubmit');
const matchSelect = document.getElementById('matchSelect');
const winnerSelect = document.getElementById('winnerSelect');
const updateMatchBtn = document.getElementById('updateMatch');
const team1KillsInput = document.getElementById('team1-kills');
const team2KillsInput = document.getElementById('team2-kills');
let completedMatches = [];

// Close modal when clicking on X or outside
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        if (this.closest('#updateMatchModal')) {
            const shouldLogout = confirm('Do you want to exit update mode?');
            if (shouldLogout) {
                isAdminLoggedIn = false;
                localStorage.removeItem('isAdminLoggedIn');
                document.getElementById('resetTournament').style.display = "none";
                adminLoginBtn.innerHTML = '<i class="fas fa-gamepad"></i> Update Game';
            }
        }
        adminModal.style.display = "none";
        updateMatchModal.style.display = "none";
    }
});

window.onclick = function(event) {
    if (event.target === adminModal || event.target === updateMatchModal) {
        if (event.target === updateMatchModal) {
            const shouldLogout = confirm('Do you want to exit update mode?');
            if (shouldLogout) {
                isAdminLoggedIn = false;
                localStorage.removeItem('isAdminLoggedIn');
                document.getElementById('resetTournament').style.display = "none";
                adminLoginBtn.innerHTML = '<i class="fas fa-gamepad"></i> Update Game';
            }
        }
        adminModal.style.display = "none";
        updateMatchModal.style.display = "none";
    }
}

// Admin Login Button Click
adminLoginBtn.onclick = () => {
    if (isAdminLoggedIn) {
        updateMatchModal.style.display = "block";
        populateMatchSelect();
    } else {
        adminModal.style.display = "block";
    }
};

// Login Submit
loginSubmit.onclick = () => {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        localStorage.setItem('isAdminLoggedIn', 'true');
        adminModal.style.display = "none";
        updateMatchModal.style.display = "block";
        document.getElementById('resetTournament').style.display = "block";
        document.getElementById('adminPassword').value = '';
        adminLoginBtn.innerHTML = '<i class="fas fa-gamepad"></i> Update Game';
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
    const selectedMatch = generateFixtures()[parseInt(matchSelect.value)];
    if (selectedMatch) {
        winnerSelect.innerHTML = `
            <option value="">Select Winner</option>
            <option value="${selectedMatch.team1}">${selectedMatch.team1}</option>
            <option value="${selectedMatch.team2}">${selectedMatch.team2}</option>
            <option value="draw">Draw</option>
        `;
        
        // Update kill input labels with team names
        document.getElementById('team1-label').textContent = `${selectedMatch.team1} Kills:`;
        document.getElementById('team2-label').textContent = `${selectedMatch.team2} Kills:`;
        
        document.getElementById('team1-kills').placeholder = `Enter ${selectedMatch.team1} kills`;
        document.getElementById('team2-kills').placeholder = `Enter ${selectedMatch.team2} kills`;
    } else {
        winnerSelect.innerHTML = '<option value="">Select Winner</option>';
        document.getElementById('team1-label').textContent = 'Team Kills:';
        document.getElementById('team2-label').textContent = 'Team Kills:';
        document.getElementById('team1-kills').placeholder = '';
        document.getElementById('team2-kills').placeholder = '';
    }
};

// Update match result handler
updateMatchBtn.onclick = () => {
    const matchIndex = parseInt(matchSelect.value);
    const winner = winnerSelect.value;
    const team1Kills = parseInt(team1KillsInput.value) || 0;
    const team2Kills = parseInt(team2KillsInput.value) || 0;

    if (matchIndex >= 0 && winner) {
        const match = generateFixtures()[matchIndex];

        // Update match statistics
        pointsTable[match.team1].matchesPlayed++;
        pointsTable[match.team2].matchesPlayed++;

        if (winner === 'draw') {
            // Handle draw - 2 points each
            pointsTable[match.team1].draws++;
            pointsTable[match.team2].draws++;
            pointsTable[match.team1].points += 2;
            pointsTable[match.team2].points += 2;
        } else {
            // Handle win/loss - 5 points for win
            const loser = winner === match.team1 ? match.team2 : match.team1;
            pointsTable[winner].wins++;
            pointsTable[winner].points += 5;
            pointsTable[loser].losses++;
        }

        // Add kill points
        pointsTable[match.team1].kills += team1Kills;
        pointsTable[match.team1].points += team1Kills;
        pointsTable[match.team2].kills += team2Kills;
        pointsTable[match.team2].points += team2Kills;

        // Mark match as completed
        completedMatches.push(matchIndex);

        // Update UI
        saveData();
        renderPointsTable();
        renderFixtures();

        // Reset form
        updateMatchModal.style.display = "none";
        matchSelect.value = "";
        winnerSelect.innerHTML = '<option value="">Select Winner</option>';
        team1KillsInput.value = "";
        team2KillsInput.value = "";
        
        // Reset team kill labels
        document.getElementById('team1-label').textContent = 'Team Kills:';
        document.getElementById('team2-label').textContent = 'Team Kills:';
    } else {
        alert("Please select both match and winner");
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
    document.getElementById('resetTournament').style.display = isAdminLoggedIn ? "block" : "none";
    
    // Add event listener for reset tournament button
    document.getElementById('resetTournament').addEventListener('click', resetTournament);
    
    // Update total matches and players count
    document.getElementById('totalMatches').textContent = `${generateFixtures().length} Matches`;
    document.getElementById('totalPlayers').textContent = `${teams.reduce((acc, team) => acc + team.players.length, 0)} Players`;
});
