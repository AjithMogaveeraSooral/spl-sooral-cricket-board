let allTournaments = [];

function generateBattingTable(team, score, stats, inningsNumber) {
    let tableHtml = `
        <h4 style="color: var(--text-color); margin-top: 20px;">${team} - ${score} (Innings ${inningsNumber})</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="background-color: rgba(2, 244, 212, 0.2);">
                    <th style="padding: 8px; text-align: left;">Batter</th>
                    <th style="padding: 8px; text-align: left;">Status</th>
                    <th style="padding: 8px; text-align: right;">R</th>
                    <th style="padding: 8px; text-align: right;">B</th>
                    <th style="padding: 8px; text-align: right;">4s</th> <th style="padding: 8px; text-align: right;">6s</th>
                </tr>
            </thead>
            <tbody>
    `;
    stats.forEach(s => {
        tableHtml += `
            <tr>
                <td style="padding: 8px; border-top: 1px solid rgba(255,255,255,0.1);">${s.name}</td>
                <td style="padding: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-style: italic; font-size: 0.9em;">${s.status}</td>
                <td style="padding: 8px; border-top: 1px solid rgba(255,255,255,0.1); text-align: right; font-weight: bold;">${s.runs}</td>
                <td style="padding: 8px; border-top: 1px solid rgba(255,255,255,0.1); text-align: right;">${s.balls}</td>
                <td style="padding: 8px; border-top: 1px solid rgba(255,255,255,0.1); text-align: right;">${s.fours}</td> <td style="padding: 8px; border-top: 1px solid rgba(255,255,255,0.1); text-align: right;">${s.sixes}</td>
            </tr>
        `;
    });
    tableHtml += `</tbody></table>`;
    return tableHtml;
}

function generateBowlingTable(stats) {
    let tableHtml = `
        <h4 style="color: var(--text-color); margin-top: 20px;">Bowling Analysis</h4>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: rgba(2, 244, 212, 0.2);">
                    <th style="padding: 8px; text-align: left;">Bowler</th>
                    <th style="padding: 8px; text-align: right;">O</th>
                    <th style="padding: 8px; text-align: right;">R</th>
                    <th style="padding: 8px; text-align: right;">W</th>
                </tr>
            </thead>
            <tbody>
    `;
    stats.forEach(s => {
        tableHtml += `
            <tr>
                <td style="padding: 8px; border-top: 1px solid rgba(255,255,255,0.1);">${s.name}</td>
                <td style="padding: 8px; border-top: 1px solid rgba(255,255,255,0.1); text-align: right;">${s.overs}</td>
                <td style="padding: 8px; border-top: 1px solid rgba(255,255,255,0.1); text-align: right;">${s.runs}</td>
                <td style="padding: 8px; border-top: 1px solid rgba(255,244,212,0.1); text-align: right; font-weight: bold; color: var(--accent-color);">${s.wickets}</td>
            </tr>
        `;
    });
    tableHtml += `</tbody></table>`;
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
        <div class="match-card" onclick="displayScorecard('${match.match_id}')">
            <h4>${match.teams[0]} vs ${match.teams[1]}</h4>
            <p>Winner: <span class="match-winner">${match.winner}</span></p>
            <p>Man of the Match: ${match.man_of_the_match}</p>
            <p style="font-size: 0.8em; color: var(--accent-color);">Click for Full Scorecard</p>
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
    const scorecardDisplay = document.getElementById('match-details');
    scorecardDisplay.innerHTML = "Click on any match card to view the full scorecard details.";

    if (!selectedId) {
        document.getElementById('matches-container').innerHTML = `<p>Select a tournament above to see the matches.</p>`;
        return;
    }

    const selectedTournament = allTournaments.find(t => t.id === selectedId);

    if (selectedTournament) {
        renderMatchCards(selectedTournament.matches);
    } else {
        document.getElementById('matches-container').innerHTML = `<p>Tournament data not available.</p>`;
    }
}

function displayScorecard(matchId) {
    const selector = document.getElementById('tournament-selector');
    const selectedId = selector.value;

    const selectedTournament = allTournaments.find(t => t.id === selectedId);
    const match = selectedTournament ? selectedTournament.matches.find(m => m.match_id === matchId) : null;
    
    const displayArea = document.getElementById('match-details');
    
    if (match && match.detailed_scorecard) {
        const scorecard = match.detailed_scorecard;

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
        
        displayArea.innerHTML = `
            <h3>Match: ${match.teams[0]} vs ${match.teams[1]}</h3>
            <p style="font-size: 1.1em; margin-bottom: 15px;">**Result:** ${scorecard.result_summary}. 
            **Man of the Match:** <span style="color: var(--accent-color); font-weight: bold;">${match.man_of_the_match}</span></p>
            
            <hr style="border-color: var(--accent-color);">
            
            <h4 style="color: var(--accent-color); margin-top: 25px;">Innings 1</h4>
            ${innings1Batting}
            ${innings1Bowling}
            
            <hr style="border-color: rgba(2, 244, 212, 0.3);">

            <h4 style="color: var(--accent-color); margin-top: 25px;">Innings 2</h4>
            ${innings2Batting}
            ${innings2Bowling}
        `;
    } else {
        displayArea.innerHTML = `<p>Scorecard not found for Match ID: ${matchId} or detailed data is missing.</p>`;
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