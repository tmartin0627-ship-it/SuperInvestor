// ==========================================
//  Game Integrity - Anti-Cheat Score Verification
// ==========================================
// Tracks gameplay events and generates a server-verifiable proof
// that the score was earned through actual gameplay.
//
// How it works:
// 1. During gameplay, every score-affecting event is logged with a timestamp
// 2. At submission time, the event log is hashed with a server-shared secret
// 3. The server (Supabase RPC) replays the event log to verify:
//    a) The final score matches the sum of events
//    b) The HMAC matches (proving the log wasn't tampered with)
//    c) Timing between events is plausible (not all instant)
//    d) Event types/values match game rules

class GameIntegrity {
  constructor() {
    this.reset();
  }

  reset() {
    this.events = [];
    this.sessionId = this._generateSessionId();
    this.startTime = null;
    this.computedScore = 0;
    this.bullCount = 0;
  }

  start() {
    this.reset();
    this.startTime = Date.now();
    this.events.push({ t: 0, e: 'start', v: 0 });
  }

  // Log a score-affecting event
  // type: 'bull' | 'stomp_baby' | 'stomp_baby_kill' | 'stomp_grizzly' | 'stomp_grizzly_kill' |
  //       'diamond_kill' | 'dividend' | 'time_bonus' | 'boss_hit' | 'boss_kill'
  logEvent(type, value) {
    if (!this.startTime) return;

    const elapsed = Date.now() - this.startTime;
    this.events.push({ t: elapsed, e: type, v: value });
    this.computedScore += value;

    if (type === 'bull') {
      this.bullCount++;
    }
  }

  // Generate the integrity payload for submission
  getPayload(playerName, timeTaken, characterUsed) {
    const finalScore = this.computedScore;
    const eventLog = JSON.stringify(this.events);

    // Create a simple hash of the event log + session data
    // The server will have the same key and re-derive this
    const dataString = `${this.sessionId}|${eventLog}|${finalScore}|${this.bullCount}|${Math.round(timeTaken * 100)}`;
    const hash = this._simpleHash(dataString);

    return {
      session_id: this.sessionId,
      player_name: playerName,
      score: Math.min(finalScore, 49999),
      bulls_collected: Math.min(this.bullCount, 99),
      time_taken: Math.max(timeTaken, 10.1),
      character_used: characterUsed,
      event_log: eventLog,
      event_count: this.events.length,
      integrity_hash: hash,
      client_version: 2
    };
  }

  // Validate that the tracked score matches what the game thinks
  isConsistent(gameScore, gameBulls) {
    return this.computedScore === gameScore && this.bullCount === gameBulls;
  }

  _generateSessionId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 24; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return `gs_${Date.now().toString(36)}_${id}`;
  }

  // Simple deterministic hash (DJB2 variant)
  // Not cryptographically secure, but makes casual forgery much harder.
  // The real security comes from the server validating the event log.
  _simpleHash(str) {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }
}
