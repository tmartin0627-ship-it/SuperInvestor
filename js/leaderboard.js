// ==========================================
//  Leaderboard - Supabase Integration
// ==========================================
// Handles score submission, leaderboard fetching, and name input UI.
// Fails gracefully — game works fine if Supabase is unreachable.

class Leaderboard {
  constructor(supabaseUrl, supabaseAnonKey) {
    this.supabase = null;
    this.playerName = localStorage.getItem('bullrun_playerName') || null;
    this.submittedThisSession = false;
    this.lastLeaderboard = null;
    this.lastRank = null;

    // Initialize Supabase client if the library loaded
    try {
      if (typeof supabase !== 'undefined' && supabase.createClient) {
        this.supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
      }
    } catch (e) {
      console.warn('Leaderboard: Supabase client failed to initialize', e);
    }
  }

  isAvailable() {
    return this.supabase !== null;
  }

  hasPlayerName() {
    return this.playerName !== null && this.playerName.length > 0;
  }

  setPlayerName(name) {
    this.playerName = name.trim().substring(0, 16);
    localStorage.setItem('bullrun_playerName', this.playerName);
  }

  async submitScore(score, bullsCollected, timeTaken, characterUsed) {
    if (!this.isAvailable() || this.submittedThisSession) return null;

    try {
      const { data, error } = await this.supabase
        .from('scores')
        .insert({
          player_name: this.playerName,
          score: Math.min(score, 49999),
          bulls_collected: Math.min(bullsCollected, 99),
          time_taken: Math.max(timeTaken, 10.1),
          character_used: characterUsed
        })
        .select();

      if (error) {
        console.warn('Leaderboard: Submit failed', error.message);
        return null;
      }

      this.submittedThisSession = true;

      // Fetch rank + leaderboard after submission
      const [rankResult, lbResult] = await Promise.all([
        this.getPlayerRank(),
        this.getTopScores()
      ]);

      return {
        rank: rankResult ? rankResult.rank : null,
        total: rankResult ? rankResult.total : null,
        leaderboard: lbResult
      };
    } catch (e) {
      console.warn('Leaderboard: Submit error', e);
      return null;
    }
  }

  async getTopScores(limit = 10) {
    if (!this.isAvailable()) return null;

    try {
      const { data, error } = await this.supabase
        .from('scores')
        .select('player_name, score, bulls_collected, time_taken, character_used')
        .order('score', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Leaderboard: Fetch failed', error.message);
        return null;
      }

      this.lastLeaderboard = data;
      return data;
    } catch (e) {
      console.warn('Leaderboard: Fetch error', e);
      return null;
    }
  }

  async getPlayerRank() {
    if (!this.isAvailable() || !this.playerName) return null;

    try {
      const { data, error } = await this.supabase
        .rpc('get_player_rank', { p_name: this.playerName });

      if (error) {
        console.warn('Leaderboard: Rank query failed', error.message);
        return null;
      }

      if (data && data.length > 0) {
        this.lastRank = { rank: data[0].rank, total: data[0].total };
        return this.lastRank;
      }
      return null;
    } catch (e) {
      console.warn('Leaderboard: Rank error', e);
      return null;
    }
  }

  resetSession() {
    this.submittedThisSession = false;
    this.lastLeaderboard = null;
    this.lastRank = null;
  }

  // ==========================================
  //  Name Input DOM Overlay
  // ==========================================
  showNameInput(onSubmit, onSkip) {
    // Remove existing overlay if any
    this.hideNameInput();

    const overlay = document.createElement('div');
    overlay.id = 'leaderboard-name-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'display:flex;align-items:center;justify-content:center;' +
      'background:rgba(0,0,0,0.85);z-index:1000;font-family:sans-serif;';

    const box = document.createElement('div');
    box.style.cssText = 'background:#0a0a2e;border:2px solid #FFD700;border-radius:12px;' +
      'padding:24px 32px;text-align:center;max-width:360px;width:90%;';

    const title = document.createElement('div');
    title.textContent = 'SUBMIT YOUR SCORE';
    title.style.cssText = 'color:#FFD700;font-size:20px;font-weight:bold;margin-bottom:16px;';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.maxLength = 16;
    inputField.placeholder = 'Enter your name';
    inputField.value = this.playerName || '';
    inputField.autocomplete = 'off';
    inputField.style.cssText = 'width:100%;padding:10px 14px;font-size:18px;font-weight:bold;' +
      'background:#1a1a3e;border:2px solid #555;border-radius:8px;color:#fff;' +
      'text-align:center;outline:none;font-family:monospace;box-sizing:border-box;';
    inputField.addEventListener('focus', () => {
      inputField.style.borderColor = '#FFD700';
    });
    inputField.addEventListener('blur', () => {
      inputField.style.borderColor = '#555';
    });
    // Filter out non-alphanumeric (allow spaces)
    inputField.addEventListener('input', () => {
      inputField.value = inputField.value.replace(/[^a-zA-Z0-9 _-]/g, '');
    });

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:12px;margin-top:16px;justify-content:center;';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit Score';
    submitBtn.style.cssText = 'padding:10px 24px;font-size:16px;font-weight:bold;' +
      'background:#FFD700;color:#000;border:none;border-radius:8px;cursor:pointer;' +
      'font-family:sans-serif;';
    submitBtn.addEventListener('click', () => {
      const name = inputField.value.trim();
      if (name.length > 0) {
        this.setPlayerName(name);
        this.hideNameInput();
        onSubmit(name);
      } else {
        inputField.style.borderColor = '#FF4444';
        inputField.placeholder = 'Name required!';
      }
    });

    const skipBtn = document.createElement('button');
    skipBtn.textContent = 'Skip';
    skipBtn.style.cssText = 'padding:10px 20px;font-size:14px;' +
      'background:transparent;color:#888;border:1px solid #555;border-radius:8px;' +
      'cursor:pointer;font-family:sans-serif;';
    skipBtn.addEventListener('click', () => {
      this.hideNameInput();
      onSkip();
    });

    // Enter key submits
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        submitBtn.click();
      }
    });

    btnRow.appendChild(submitBtn);
    btnRow.appendChild(skipBtn);
    box.appendChild(title);
    box.appendChild(inputField);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Focus the input after a short delay (helps mobile keyboards)
    setTimeout(() => inputField.focus(), 100);
  }

  hideNameInput() {
    const existing = document.getElementById('leaderboard-name-overlay');
    if (existing) existing.remove();
  }
}
