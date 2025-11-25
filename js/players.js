let allPlayersData = [];
let rankedPlayersData = [];

function parseBestSpell(spell) {
    if (!spell || typeof spell !== "string") return { wickets: 0, runs: 0 };
    const s = spell.trim();
    if (s === "" || s === "0-0") return { wickets: 0, runs: 0 };
    const parts = s.includes('-') ? s.split('-') : s.includes('/') ? s.split('/') : [s, "0"];
    return {
        wickets: parseInt(parts[0] || "0", 10) || 0,
        runs: parseInt(parts[1] || "0", 10) || 0
    };
}

function calculateBattingRating(p) {
    const runs = Number(p.total_runs || 0);
    const innings = Number(p.innings || 0);
    const not_outs = Number(p.not_outs || 0);
    const balls = Number(p.balls_faced || 0);
    const outs = Math.max(innings - not_outs, 1);
    const average = runs / outs;
    const strikeRate = balls > 0 ? (runs / balls) * 100 : 0;

    const points =
        runs * 1 +
        average * 18 +
        strikeRate * 0.45 +
        (Number(p.highest_score) || 0) * 2;

    return {
        points: Math.round(points * 100) / 100,
        average: Math.round(average * 100) / 100,
        strikeRate: Math.round(strikeRate * 100) / 100
    };
}

function calculateBowlingRating(p) {
    const totalWickets = Number(p.wickets || 0);
    const totalBalls = Number(p.total_balls_bowled || 0);
    const conceded = Number(p.total_runs_conceded || 0);
    const overs = totalBalls > 0 ? (Math.floor(totalBalls / 6) + (totalBalls % 6) / 10) : 0;
    const economy = totalBalls > 0 ? (conceded / (totalBalls / 6)) : 0;
    const bowlStrikeRate = totalWickets > 0 ? (totalBalls / totalWickets) : 0;

    const best = parseBestSpell(p.best_spell);

    const points =
        totalWickets * 24 +
        (best.wickets || 0) * 14 -
        (best.runs || 0) * 0.15 +
        (Number(p.maidens) || 0) * 7 +
        (Number(p.three_wicket_hauls) || 0) * 9 +
        (Number(p.four_wicket_hauls) || 0) * 14 +
        (Number(p.five_wicket_hauls) || 0) * 24 -
        economy * 1.5;

    return {
        points: Math.round(points * 100) / 100,
        economy: Math.round(economy * 100) / 100,
        strikeRate: Math.round(bowlStrikeRate * 100) / 100,
        overs: overs
    };
}

function calculateAllrounderRating(bat, bowl) {
    if (!bat || !bowl) return 0;
    const raw = (bat * bowl) / 100;
    return Math.round(raw * 100) / 100;
}

function assignRanks(list, key, hideZero = false) {
    const sorted = [...list].sort((a, b) => (b[key] || 0) - (a[key] || 0));
    let rank = 1;
    let lastScore = null;
    let lastRank = 1;

    sorted.forEach(p => {
        const score = Number(p[key] || 0);
        if (hideZero && score <= 0) {
            p.temp_rank = null;
        } else {
            if (lastScore !== null && score === lastScore) {
                p.temp_rank = lastRank;
            } else {
                p.temp_rank = rank;
                lastRank = rank;
            }
        }
        lastScore = score;
        rank++;
    });

    return new Map(sorted.map(p => [p.player_id, p.temp_rank]));
}

function calculateRanks(players) {
    let list = players.map(p => {
        const bat = calculateBattingRating(p);
        return {
            ...p,
            batting_points: bat.points,
            batting_average: bat.average,
            batting_strike_rate: bat.strikeRate
        };
    });

    const battingRanks = assignRanks(list, "batting_points");

    list = list.map(p => {
        const bowl = calculateBowlingRating(p);
        return {
            ...p,
            bowling_points: bowl.points,
            bowling_economy: bowl.economy,
            bowling_strike_rate: bowl.strikeRate,
            bowling_overs_calc: bowl.overs
        };
    });

    // CORRECT LOGIC: Ranking is based on the calculated bowling_points
    const bowlingRanks = assignRanks(list, "bowling_points");

    list = list.map(p => {
        const ar = calculateAllrounderRating(p.batting_points || 0, p.bowling_points || 0);
        return {
            ...p,
            allrounder_points: ar
        };
    });

    const allrounderRanks = assignRanks(list, "allrounder_points", true);

    return list.map(p => ({
        ...p,
        batting_rank: battingRanks.get(p.player_id) || null,
        bowling_rank: bowlingRanks.get(p.player_id) || null,
        allrounder_rank: allrounderRanks.get(p.player_id) || null
    }));
}

function sortPlayersByName(players) {
    return [...players].sort((a, b) =>
        a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
    );
}

function safeDisplay(v, fallback = "—") {
    if (v === null || v === undefined) return fallback;
    return String(v);
}

function createPlayerCard(player) {
    const imageUrl = player.profile_image_url || "images/default_player.jpg";

    const battingRankDisplay = player.batting_rank ? `#${player.batting_rank}` : "—";
    const bowlingRankDisplay = player.bowling_rank ? `#${player.bowling_rank}` : "—";
    const allrounderRankDisplay = player.allrounder_rank ? `#${player.allrounder_rank}` : "—";

    const battingAvg = player.batting_average || "—";
    const strikeRate = player.batting_strike_rate || "0.00";

    const bowlingEconomy = player.bowling_economy || "—";
    const bowlingSR = player.bowling_strike_rate || "—";
    const best = parseBestSpell(player.best_spell || "0-0");
    const bestSpellDisplay = `${best.wickets}-${best.runs}`;
    const overs = player.bowling_overs_calc || 0;

    return `
        <div class="player-card" style="padding:12px; border-radius:10px; background:linear-gradient(180deg,#0b1220,#061219); color:#e6eef8; box-shadow:0 6px 18px rgba(0,0,0,0.45);">
            <div style="display:flex; align-items:center; gap:12px;">
                <img src="${imageUrl}" style="width:80px; height:80px; object-fit:cover; border-radius:50%; border:2px solid rgba(0,200,180,0.2);">
                <div style="flex:1;">
                    <h3 style="margin:0; font-size:1.15rem;">${player.name}</h3>

                    <div style="display:flex; gap:14px; margin-top:4px;">
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#FFD700;">Bat</div>
                            <div style="font-weight:700;">${battingRankDisplay}</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#C0C0C0;">Bowl</div>
                            <div style="font-weight:700;">${bowlingRankDisplay}</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#CD7F32;">AllR</div>
                            <div style="font-weight:700;">${allrounderRankDisplay}</div>
                        </div>
                    </div>

                    <div style="margin-top:6px; font-size:0.85rem; color:#bcd;">
                        Matches: ${safeDisplay(player.matches)} • Innings: ${safeDisplay(player.innings)}
                    </div>
                </div>
            </div>

            <div style="margin-top:10px; display:flex; gap:12px; flex-wrap:wrap;">
                <div style="flex:1; min-width:160px;">
                    <div style="font-size:0.85rem; color:#9be7d6;">Batting</div>
                    <div style="font-weight:700;">Runs: ${safeDisplay(player.total_runs)}</div>
                    <div style="font-size:0.85rem; color:#cfe;">HS: ${safeDisplay(player.highest_score)} • 4s: ${safeDisplay(player.fours)} • 6s: ${safeDisplay(player.sixes)}</div>
                    <div style="font-size:0.85rem; color:#cfe; margin-top:4px;">Balls: ${safeDisplay(player.balls_faced)} • SR: ${strikeRate} • AVG: ${battingAvg}</div>
                </div>

                <div style="flex:1; min-width:160px;">
                    <div style="font-size:0.85rem; color:#9be7d6;">Bowling</div>
                    <div style="font-weight:700;">Wickets: ${safeDisplay(player.wickets)}</div>
                    <div style="font-size:0.85rem; color:#cfe;">Best: ${bestSpellDisplay} • Overs: ${overs}</div>
                    <div style="font-size:0.85rem; color:#cfe; margin-top:4px;">Econ: ${bowlingEconomy} • SR: ${bowlingSR}</div>
                    <div style="font-size:0.85rem; color:#cfe; margin-top:4px;">3W: ${safeDisplay(player.three_wicket_hauls)} • 4W: ${safeDisplay(player.four_wicket_hauls)} • 5W: ${safeDisplay(player.five_wicket_hauls)}</div>
                </div>

                <div style="flex-basis:100%; height:1px; background:rgba(255,255,255,0.1); margin:6px 0;"></div>

                <div style="width:100%; display:flex; justify-content:space-between; flex-wrap:wrap; font-size:0.85rem; color:#bcd;">
                    <div>Bat Points: ${safeDisplay(player.batting_points)}</div>
                    <div>Bowl Points: ${safeDisplay(player.bowling_points)}</div>
                    <div>AllR Points: ${safeDisplay(player.allrounder_points)}</div>
                </div>
            </div>
        </div>
    `;
}

function renderPlayerCards(players) {
    const container = document.getElementById("player-cards-container");
    if (!container) return;
    container.innerHTML = players.map(createPlayerCard).join("");
}


function filterPlayers() {
    const searchInput = document.getElementById('player-search');
    const searchTerm = searchInput.value.toLowerCase();
    const sortSelect = document.getElementById('sort-by-select');

    let tempSorted = [...rankedPlayersData];
    switch (sortSelect.value) {
        case 'name':
            tempSorted = sortPlayersByName(rankedPlayersData);
            break;
        case 'batting_rank':
            tempSorted.sort((a, b) => a.batting_rank - b.batting_rank);
            break;
        case 'bowling_rank':
            tempSorted.sort((a, b) => a.bowling_rank - b.bowling_rank);
            break;
        case 'allrounder_rank':
            tempSorted.sort((a, b) => a.allrounder_rank - b.allrounder_rank);
            break;
        case 'total_runs': 
            tempSorted.sort((a, b) => b.total_runs - a.total_runs);
            break;
        case 'highest_score':
            tempSorted.sort((a, b) => b.highest_score - a.highest_score);
            break;
        case 'wickets':
            tempSorted.sort((a, b) => b.wickets - a.wickets);
            break;
        case 'sixes':
            tempSorted.sort((a, b) => (b.sixes || 0) - (a.sixes || 0));
            break;
    }

    const filteredPlayers = tempSorted.filter(player => 
        player.name.toLowerCase().includes(searchTerm)
    );
    
    renderPlayerCards(filteredPlayers);
}

async function initPlayerStats() {
    const data = await fetchSPLData();
    if (data && data.players) {
        allPlayersData = data.players.map(p => ({ ...p }));
        rankedPlayersData = sortPlayersByName(calculateRanks(allPlayersData));
        renderPlayerCards(rankedPlayersData);

        document.getElementById('sort-by-select').addEventListener('change', () => {
            filterPlayers(); 
        });
    }
}

document.addEventListener("DOMContentLoaded", initPlayerStats);