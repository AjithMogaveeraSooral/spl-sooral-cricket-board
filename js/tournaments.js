let allTournaments = [];

function generateBattingTable(team, score, stats, inningsNumber) {
    let tableHtml = `
        <div class="team-score-header">
            <span class="team-name">${team}</span>
            <span class="team-score">${score}</span>
        </div>
        <div class="scorecard-table-wrapper">
            <table class="scorecard-table">
                <thead>
                    <tr>
                        <th>Batter</th>
                        <th class="player-status">Status</th>
                        <th class="text-right">R</th>
                        <th class="text-right">B</th>
                        <th class="text-right">4s</th>
                        <th class="text-right">6s</th>
                    </tr>
                </thead>
                <tbody>
    `;
    stats.forEach(s => {
        tableHtml += `
            <tr>
                <td class="player-name">${s.name}</td>
                <td class="player-status">${s.status}</td>
                <td class="text-right stat-runs">${s.runs}</td>
                <td class="text-right">${s.balls}</td>
                <td class="text-right">${s.fours}</td>
                <td class="text-right">${s.sixes}</td>
            </tr>
        `;
    });
    tableHtml += `</tbody></table></div>`;
    return tableHtml;
}

function generateBowlingTable(stats) {
    let tableHtml = `
        <div class="bowling-section-title">Bowling</div>
        <div class="scorecard-table-wrapper">
            <table class="scorecard-table">
                <thead>
                    <tr>
                        <th>Bowler</th>
                        <th class="text-right">O</th>
                        <th class="text-right">R</th>
                        <th class="text-right">W</th>
                    </tr>
                </thead>
                <tbody>
    `;
    stats.forEach(s => {
        tableHtml += `
            <tr>
                <td class="player-name">${s.name}</td>
                <td class="text-right">${s.overs}</td>
                <td class="text-right">${s.runs}</td>
                <td class="text-right stat-wickets">${s.wickets}</td>
            </tr>
        `;
    });
    tableHtml += `</tbody></table></div>`;
    return tableHtml;
}

function populateTournamentSelector(tournaments) {
    const selector = document.getElementById('tournament-selector');
    selector.innerHTML = ''; 
    tournaments.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.name;
        selector.appendChild(option);
    });
}

function createMatchCard(match) {
    return `
        <div class="match-card" onclick="openScorecard('${match.match_id}')">
            <h4>⚔️ ${match.teams[0]} vs ${match.teams[1]}</h4>
            <p class="match-winner">${match.winner}</p>
            <p>🏅 ${match.man_of_the_match}</p>
            <p style="font-size: 0.85em; color: var(--accent-color); margin-top: 10px;">Click to view scorecard →</p>
        </div>
    `;
}

function renderMatchCards(matches) {
    const container = document.getElementById('matches-container');
    if (matches.length === 0) {
        container.innerHTML = `<p>No matches found for this season. Check back soon!</p>`;
        return;
    }
    container.innerHTML = matches.map(createMatchCard).join('');
}

function loadMatches() {
    const selector = document.getElementById('tournament-selector');
    const selectedId = selector.value;

    if (!selectedId) {
        document.getElementById('matches-container').innerHTML = `
            <div class="empty-matches">
                <div class="icon">🏏</div>
                <p>Select a tournament above to see the matches</p>
            </div>
        `;
        return;
    }

    const selectedTournament = allTournaments.find(t => t.id === selectedId);

    if (selectedTournament) {
        renderMatchCards(selectedTournament.matches);
    } else {
        document.getElementById('matches-container').innerHTML = `<p>Tournament data not available.</p>`;
    }
}

function openScorecard(matchId) {
    const modal = document.getElementById('scorecard-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    displayScorecard(matchId);
}

function closeScorecard() {
    const modal = document.getElementById('scorecard-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeModal(event) {
    if (event.target.id === 'scorecard-modal') {
        closeScorecard();
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeScorecard();
    }
});

function displayScorecard(matchId) {
    const selector = document.getElementById('tournament-selector');
    const selectedId = selector.value;

    const selectedTournament = allTournaments.find(t => t.id === selectedId);
    const match = selectedTournament ? selectedTournament.matches.find(m => m.match_id === matchId) : null;
    
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (match && match.detailed_scorecard) {
        const scorecard = match.detailed_scorecard;

        modalTitle.textContent = `${match.teams[0]} vs ${match.teams[1]}`;

        const innings1Batting = generateBattingTable(
            scorecard.innings1.batting_team, 
            scorecard.innings1.score, 
            scorecard.innings1.batting_stats,
            1
        );
        const innings1Bowling = generateBowlingTable(scorecard.innings1.bowling_stats);
        
        const innings2Batting = generateBattingTable(
            scorecard.innings2.batting_team, 
            scorecard.innings2.score, 
            scorecard.innings2.batting_stats,
            2
        );
        const innings2Bowling = generateBowlingTable(scorecard.innings2.bowling_stats);
        
        modalBody.innerHTML = `
            <div class="match-result-banner">
                <div class="result-text">${scorecard.result_summary}</div>
                <div class="mom-text">🏅 Man of the Match: ${match.man_of_the_match}</div>
            </div>
            
            <div class="innings-section">
                <div class="innings-header">
                    <span class="innings-badge">1st</span>
                    <h4>Innings</h4>
                </div>
                ${innings1Batting}
                ${innings1Bowling}
            </div>

            <div class="innings-section">
                <div class="innings-header">
                    <span class="innings-badge">2nd</span>
                    <h4>Innings</h4>
                </div>
                ${innings2Batting}
                ${innings2Bowling}
            </div>
        `;
    } else {
        modalTitle.textContent = 'Scorecard Not Found';
        modalBody.innerHTML = `<p style="text-align: center; color: #a0a0c0;">Scorecard not found for Match ID: ${matchId} or detailed data is missing.</p>`;
    }
}


async function initTournaments() {
    const data = await fetchSPLData(); 
    if (data && data.tournaments) {
        allTournaments = data.tournaments;
        populateTournamentSelector(allTournaments);
        
        document.getElementById('tournament-selector').addEventListener('change', loadMatches);

        if (allTournaments.length > 0) {
            document.getElementById('tournament-selector').value = allTournaments[0].id;
            loadMatches(); 
        }
    }
}

document.addEventListener('DOMContentLoaded', initTournaments);