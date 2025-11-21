let allPlayersData = [];
let rankedPlayersData = [];

// --- RANKING CALCULATION LOGIC ---

function calculateRanks(players) {
    // 1. Sort for Batting Rank (Total Runs)
    const battingSorted = [...players].sort((a, b) => b.total_runs - a.total_runs);
    // ... (rest of the ranking logic remains the same)
    const battingMap = new Map(battingSorted.map((player, index) => [player.player_id, index + 1]));

    // 2. Sort for Bowling Rank (Total Wickets)
    const bowlingSorted = [...players].sort((a, b) => b.wickets - a.wickets);
    const bowlingMap = new Map(bowlingSorted.map((player, index) => [player.player_id, index + 1]));

    // 3. Sort for All-rounder Rank (All-rounder Rating)
    const allrounderSorted = [...players].sort((a, b) => b.all_rounder_rating - a.all_rounder_rating);
    const allrounderMap = new Map(allrounderSorted.map((player, index) => [player.player_id, index + 1]));
    
    // Assign ranks back to the player objects
    return players.map(player => ({
        ...player,
        batting_rank: battingMap.get(player.player_id),
        bowling_rank: bowlingMap.get(player.player_id),
        allrounder_rank: allrounderMap.get(player.player_id)
    }));
}

// --- NEW SORTING FUNCTION ---

function sortPlayersByName(players) {
    // Sorts players alphabetically by name (case-insensitive)
    return [...players].sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0; // names must be equal
    });
}


// --- RENDERING LOGIC ---

// Function to create an HTML card for a single player
function createPlayerCard(player) {
    const imageUrl = player.profile_image_url || 'images/default_player.jpg';
    
    return `
        <div class="player-card" data-name="${player.name.toLowerCase()}">
            <div style="display:flex; align-items: center; margin-bottom: 15px;">
                <img src="${imageUrl}" alt="${player.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 50%; border: 3px solid var(--accent-color); margin-right: 15px;">
                
                <h3 style="margin: 0; padding: 0; border: none; font-size: 1.5em; color: white;">${player.name}</h3>
            </div>
            
            <hr style="border-color: var(--accent-color);">

            <div style="margin-bottom: 15px; display: flex; justify-content: space-around; text-align: center;">
                <div>
                    <span class="stat-label" style="color:#FFD700; width: auto;">Batting 🏏</span>
                    <p style="font-size: 1.5em; font-weight: bold; margin: 2px 0;">#${player.batting_rank}</p>
                </div>
                <div>
                    <span class="stat-label" style="color:#C0C0C0; width: auto;">Bowling 🥎</span>
                    <p style="font-size: 1.5em; font-weight: bold; margin: 2px 0;">#${player.bowling_rank}</p>
                </div>
                <div>
                    <span class="stat-label" style="color:#CD7F32; width: auto;">All-rounder ⭐</span>
                    <p style="font-size: 1.5em; font-weight: bold; margin: 2px 0;">#${player.allrounder_rank}</p>
                </div>
            </div>

            <hr style="border-color: rgba(2, 244, 212, 0.3);">
            
            <p><span class="stat-label">Matches Played:</span> ${player.matches}</p>
            <p><span class="stat-label">Innings Batted:</span> ${player.innings}</p>
            <p><span class="stat-label">Total Runs:</span> <strong>${player.total_runs}</strong></p>
            <p><span class="stat-label">Highest Score:</span> ${player.highest_score}</p>
            <p><span class="stat-label">Wickets Taken:</span> <strong>${player.wickets}</strong></p>
            <p><span class="stat-label">Best Spell:</span> ${player.best_spell}</p>
        </div>
    `;
}

// Function to render the player cards to the DOM
function renderPlayerCards(players) {
    const container = document.getElementById('player-cards-container');
    container.innerHTML = players.map(createPlayerCard).join('');
}

// Global function exposed to the HTML input (onkeyup) to filter players
function filterPlayers() {
    const searchInput = document.getElementById('player-search');
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter the ranked data array
    const filteredPlayers = rankedPlayersData.filter(player => 
        player.name.toLowerCase().includes(searchTerm)
    );
    
    // Re-render only the filtered players
    renderPlayerCards(filteredPlayers);
}

// Main initialization function for the page
async function initPlayerStats() {
    // Assuming fetchSPLData() is defined elsewhere and returns the player data
    const data = await fetchSPLData(); 
    if (data && data.players) {
        allPlayersData = data.players;
        
        // 1. Calculate ranks for all players
        let playersWithRanks = calculateRanks(allPlayersData);
        
        // 2. Sort the ranked players alphabetically by name (NEW STEP)
        rankedPlayersData = sortPlayersByName(playersWithRanks);
        
        // 3. Render the sorted, ranked players initially
        renderPlayerCards(rankedPlayersData); 
    }
}

document.addEventListener('DOMContentLoaded', initPlayerStats);