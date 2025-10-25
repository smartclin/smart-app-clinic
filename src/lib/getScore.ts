// lib/growth/getWhoZScores.ts
export async function getWhoZScores() {
    const res = await fetch('/data/zscore.json');
    if (!res.ok) throw new Error('Failed to load WHO z-score data');
    return res.json();
}
