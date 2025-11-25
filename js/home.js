function safeNum(v, fallback = 0) {
    return (v === undefined || v === null || Number.isNaN(Number(v))) ? fallback : Number(v);
}

function safeDisplay(v, fallback = "—") {
    if (v === null || v === undefined) return fallback;
    if (typeof v === 'number' && !Number.isInteger(v)) {
        return v.toFixed(2);
    }
    return String(v);
}

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

function calculateRanksPointsBased(players) {
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

    const bowlingRanks = assignRanks(list, "bowling_points");

    list = list.map(p => {
        const ar = calculateAllrounderRating(p.batting_points || 0, p.bowling_points || 0);
        return {
            ...p,
            allrounder_points: ar
        };
    });

    const allrounderRanks = assignRanks(list, "allrounder_points", true);

    const rankedPlayers = list.map(p => ({
        ...p,
        batting_rank: battingRanks.get(p.player_id) || null,
        bowling_rank: bowlingRanks.get(p.player_id) || null,
        allrounder_rank: allrounderRanks.get(p.player_id) || null
    }));
    
    const battingSorted = [...rankedPlayers].sort((a, b) => (b.batting_points || 0) - (a.batting_points || 0));
    const bowlingSorted = [...rankedPlayers].sort((a, b) => (b.bowling_points || 0) - (a.bowling_points || 0));
    const allrounderSorted = [...rankedPlayers].sort((a, b) => (b.allrounder_points || 0) - (a.allrounder_points || 0));


    return {
        rankedPlayers,
        topBatter: battingSorted.find(p => p.batting_points > 0) || null,
        topBowler: bowlingSorted.find(p => p.bowling_points > 0) || null,
        topAllrounder: allrounderSorted.find(p => p.allrounder_points > 0) || null,
        battingSorted,
        bowlingSorted,
        allrounderSorted,
    };
}

function createDetailedLeaderCard(player, title, highlightStat) {
    if (!player) {
        return `
            <div class="player-card" style="padding:12px; border-radius:10px; background:linear-gradient(180deg,#0b1220,#061219); color:#e6eef8; box-shadow:0 6px 18px rgba(0,0,0,0.45); height: 100%; text-align: center;">
                <h3 style="color: #9be7d6; margin-top:0;">${title}</h3><p style="color: #bcd;">No data</p>
            </div>
        `;
    }

    const imageUrl = player.profile_image_url || "images/default_player.jpg";
    const battingRankDisplay = player.batting_rank ? `#${player.batting_rank}` : "—";
    const bowlingRankDisplay = player.bowling_rank ? `#${player.bowling_rank}` : "—";
    const allrounderRankDisplay = player.allrounder_rank ? `#${player.allrounder_rank}` : "—";

    const battingAvg = safeDisplay(player.batting_average);
    const strikeRate = safeDisplay(player.batting_strike_rate);

    const bowlingEconomy = safeDisplay(player.bowling_economy);
    const bowlingSR = safeDisplay(player.bowling_strike_rate);
    const best = parseBestSpell(player.best_spell || "0-0");
    const bestSpellDisplay = `${best.wickets}-${best.runs}`;
    const overs = safeDisplay(player.bowling_overs_calc);

    let highlightHtml = '';
    let highlightColor = '#FFD700';

    if (highlightStat === 'total_runs') {
        highlightHtml = `<span style="color:${highlightColor}; font-weight:bold;">${safeDisplay(player.total_runs)} Runs</span>`;
    } else if (highlightStat === 'wickets') {
        highlightColor = '#02f4d4'; 
        highlightHtml = `<span style="color:${highlightColor}; font-weight:bold;">${safeDisplay(player.wickets)} Wickets</span>`;
    } else if (highlightStat === 'sixes') {
        highlightColor = '#FF4500'; 
        highlightHtml = `<span style="color:${highlightColor}; font-weight:bold;">${safeDisplay(player.sixes)} Sixes</span>`;
    }
    
    return `
        <div class="player-card" style="padding:12px; border-radius:10px; background:linear-gradient(180deg,#0b1220,#061219); color:#e6eef8; box-shadow:0 6px 18px rgba(0,0,0,0.45); height: 100%;">
            <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin:0; font-size:1.15rem; color: #9be7d6;">${title}</h3>
                <div style="font-size: 1.05rem; background: rgba(2, 244, 212, 0.15); padding: 4px 8px; border-radius: 5px; border: 1px solid ${highlightColor};">${highlightHtml}</div>
            </div>

            <div style="display:flex; align-items:center; gap:12px;">
                <img src="${imageUrl}" style="width:80px; height:80px; object-fit:cover; border-radius:50%; border:2px solid rgba(0,200,180,0.2);">
                <div style="flex:1;">
                    <h3 style="margin:0; font-size:1.15rem;">${player.name}</h3>

                    <div style="display:flex; gap:14px; margin-top:4px;">
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#FFD700;">Bat Rank</div>
                            <div style="font-weight:700;">${battingRankDisplay}</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#C0C0C0;">Bowl Rank</div>
                            <div style="font-weight:700;">${bowlingRankDisplay}</div>
                        </div>
                        <div style="text-align:center;">
                            <div style="font-size:0.75rem; color:#CD7F32;">AllR Rank</div>
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
                    <div style="font-size:0.85rem; color:#9be7d6;">Batting Stats</div>
                    <div style="font-weight:700;">Runs: ${safeDisplay(player.total_runs)}</div>
                    <div style="font-size:0.85rem; color:#cfe;">HS: ${safeDisplay(player.highest_score)} • 4s: ${safeDisplay(player.fours)} • 6s: ${safeDisplay(player.sixes)}</div>
                    <div style="font-size:0.85rem; color:#cfe; margin-top:4px;">Balls: ${safeDisplay(player.balls_faced)} • SR: ${strikeRate} • AVG: ${battingAvg}</div>
                </div>

                <div style="flex:1; min-width:160px;">
                    <div style="font-size:0.85rem; color:#9be7d6;">Bowling Stats</div>
                    <div style="font-weight:700;">Wickets: ${safeDisplay(player.wickets)}</div>
                    <div style="font-size:0.85rem; color:#cfe;">Best: ${bestSpellDisplay} • Overs: ${overs}</div>
                    <div style="font-size:0.85rem; color:#cfe; margin-top:4px;">Econ: ${bowlingEconomy} • SR: ${bowlingSR}</div>
                    <div style="font-size:0.85rem; color:#cfe; margin-top:4px;">3W: ${safeDisplay(player.three_wicket_hauls)} • 4W: ${safeDisplay(player.four_wicket_hauls)} • 5W: ${safeDisplay(player.five_wicket_hauls)}</div>
                </div>

                <div style="flex-basis:100%; height:1px; background:rgba(255,255,255,0.1); margin:6px 0;"></div>

                <div style="width:100%; display:flex; justify-content:space-between; flex-wrap:wrap; font-size:0.85rem; color:#bcd;">
                    <div>Bat Pts: ${safeDisplay(player.batting_points)}</div>
                    <div>Bowl Pts: ${safeDisplay(player.bowling_points)}</div>
                    <div>AllR Pts: ${safeDisplay(player.allrounder_points)}</div>
                </div>
            </div>
        </div>
    `;
}

function createRank1Card(player, rankType) {
    const CARD_STYLE = "width: 100%; text-align: center; padding:12px; border-radius:10px; background:linear-gradient(180deg,#0b1220,#061219); color:#e6eef8; box-shadow:0 6px 18px rgba(0,0,0,0.45);";
    const IMAGE_STYLE = "width: 90px; height: 90px; object-fit: cover; border-radius: 50%; border: 4px solid var(--accent-color); margin-bottom: 10px;";

    if (!player) {
        return `<div class="player-card" style="${CARD_STYLE}"><h3 style="color: #9be7d6; margin-top:0;">#1 ${rankType}</h3><p style="color: #bcd;">No data</p></div>`;
    }

    const imageUrl = player.profile_image_url || 'images/default_player.jpg';
    const accentColor = rankType === 'BATTER' ? '#FFD700' : rankType === 'BOWLER' ? '#C0C0C0' : '#CD7F32';
    
    let mainStatHtml = '';

    if (rankType === 'BATTER') {
        mainStatHtml = `
            <div style="font-size: 0.9em; color: ${accentColor}; font-weight: bold; margin-top: 5px;">
                ${safeDisplay(player.batting_points)} Points (Avg: ${safeDisplay(player.batting_average)})
            </div>
            <div style="font-size: 0.8em; color: #bcd;">HS: ${safeDisplay(player.highest_score)} • Runs: ${safeDisplay(player.total_runs)}</div>
        `;
    } else if (rankType === 'BOWLER') {
        const best = parseBestSpell(player.best_spell || "0-0");
        mainStatHtml = `
            <div style="font-size: 0.9em; color: ${accentColor}; font-weight: bold; margin-top: 5px;">
                ${safeDisplay(player.bowling_points)} Points (Wickets: ${safeDisplay(player.wickets)})
            </div>
            <div style="font-size: 0.8em; color: #bcd;">Best: ${best.wickets}-${best.runs} • Econ: ${safeDisplay(player.bowling_economy)}</div>
        `;
    } else if (rankType === 'ALL-ROUNDER') {
        mainStatHtml = `
            <div style="font-size: 0.9em; color: ${accentColor}; font-weight: bold; margin-top: 5px;">
                ${safeDisplay(player.allrounder_points)} Points
            </div>
            <div style="font-size: 0.8em; color: #bcd;">Runs: ${safeDisplay(player.total_runs)} • Wickets: ${safeDisplay(player.wickets)}</div>
        `;
    }

    return `
        <div class="player-card" style="${CARD_STYLE}">
            <h3 style="color: ${accentColor}; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 5px; margin-bottom: 10px; margin-top: 0; font-size: 1.25rem;">#1 ${rankType}</h3>
            <img src="${imageUrl}" alt="${player.name}" style="${IMAGE_STYLE.replace('var(--accent-color)', accentColor)}">
            <p style="font-size: 1.2em; font-weight: bold; margin: 0; color: white;">${player.name}</p>
            ${mainStatHtml}
        </div>
    `;
}

const createRankingList = (playersArray, rankingType) => {
    if (!Array.isArray(playersArray)) return '';
    let listHTML = '';

    const colorMap = {
        'batting': '#FFD700', 
        'bowling': '#C0C0C0',
        'allrounder': '#CD7F32'
    };
    const accent = colorMap[rankingType] || 'var(--accent-color)';


    playersArray.filter(p => p[`${rankingType}_points`] > 0).slice(0, 5).forEach((player, index) => {
        let statValue = '';
        let secondaryStat = '';
        
        if (rankingType === 'batting') {
            statValue = `${safeDisplay(player.batting_points)} Pts`;
            secondaryStat = `HS: ${safeDisplay(player.highest_score)}`;
        } else if (rankingType === 'bowling') {
            const best = parseBestSpell(player.best_spell || "0-0");
            statValue = `${safeDisplay(player.bowling_points)} Pts`;
            secondaryStat = `${best.wickets}-${best.runs}`;
        } else {
            statValue = `${safeDisplay(player.allrounder_points)} Pts`;
            secondaryStat = `R/W: ${safeDisplay(player.total_runs)}/${safeDisplay(player.wickets)}`;
        }

        const rankStyle = index === 0 ? `color: ${accent}; font-weight: bold; font-size: 1.05em;` : 'color: #e6eef8;';
        const rankEmoji = index === 0 ? '🥇' : (index === 1 ? '🥈' : '🥉');

        listHTML += `
            <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; ${rankStyle}">
                <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="width: 25px; text-align: right;">${rankEmoji}</span> 
                    <span>${player.name}</span>
                </span>
                <span style="text-align: right;">
                    <span style="font-weight: bold; font-size: 1em; color: ${accent}; display: block;">${statValue}</span>
                    <span style="font-weight: normal; font-size: 0.8em; color: #bcd; display: block;">${secondaryStat}</span>
                </span>
            </li>
        `;
    });
    return listHTML;
};


function calculateLeader(rankedPlayers) {
    const battingSorted = [...rankedPlayers].sort((a, b) => safeNum(b.total_runs, 0) - safeNum(a.total_runs, 0));
    const bowlingSorted = [...rankedPlayers].sort((a, b) => safeNum(b.wickets, 0) - safeNum(a.wickets, 0));
    const highestSixHitterSorted = [...rankedPlayers].sort((a, b) => safeNum(b.sixes, 0) - safeNum(a.sixes, 0));
    
    return {
        topBatter: battingSorted[0] || null,
        topBowler: bowlingSorted[0] || null,
        highestSixHitter: highestSixHitterSorted[0] || null,
    };
}


async function initHomeStats() {
    const data = await fetchSPLData();
    if (!data) return;

    const players = Array.isArray(data.players) ? data.players : [];

    const {
        rankedPlayers,
        topBatter,
        topBowler,
        topAllrounder,
        battingSorted,
        bowlingSorted,
        allrounderSorted
    } = calculateRanksPointsBased(players);

    const lifetimeLeaders = calculateLeader(rankedPlayers); 

    const totalTournaments = Array.isArray(data.tournaments) ? data.tournaments.length : 0;
    const totalMatches = (Array.isArray(data.tournaments) ? data.tournaments : [])
        .reduce((sum, t) => sum + (Array.isArray(t.matches) ? t.matches.length : 0), 0);
    const totalPlayers = players.length;

    const setHtml = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    };

    setHtml('total-tournaments', `<h3>${totalTournaments}</h3><p style="color:#bcd;">Total Tournaments</p>`);
    setHtml('total-matches', `<h3>${totalMatches}</h3><p style="color:#bcd;">Total Matches Played</p>`);
    setHtml('total-players', `<h3>${totalPlayers}</h3><p style="color:#bcd;">Total Players Registered</p>`);

    setHtml('highest-scorer-card', createDetailedLeaderCard(
        lifetimeLeaders.topBatter,
        'Highest Scorer 🏏',
        'total_runs'
    ));

    setHtml('top-bowler-card', createDetailedLeaderCard(
        lifetimeLeaders.topBowler,
        'Top Wicket Taker 🥎',
        'wickets'
    ));

    setHtml('highest-six-hitter-card', createDetailedLeaderCard(
        lifetimeLeaders.highestSixHitter,
        'Highest Six Hitter 💥',
        'sixes'
    ));

    setHtml('rank-1-batter-card', createRank1Card(topBatter, 'BATTER'));
    setHtml('rank-1-bowler-card', createRank1Card(topBowler, 'BOWLER'));
    setHtml('rank-1-allrounder-card', createRank1Card(topAllrounder, 'ALL-ROUNDER'));

    const setList = (selector, html) => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = html;
    };

    setList('#batting-ranking ul', battingSorted ? createRankingList(battingSorted, 'batting') : '');
    setList('#bowling-ranking ul', bowlingSorted ? createRankingList(bowlingSorted, 'bowling') : '');
    setList('#allrounder-ranking ul', allrounderSorted ? createRankingList(allrounderSorted, 'allrounder') : '');
}

document.addEventListener('DOMContentLoaded', initHomeStats);