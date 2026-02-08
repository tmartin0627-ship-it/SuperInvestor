// ==========================================
//  BULL RUN - Main Game Loop & State Machine
// ==========================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const input = new InputHandler();
const touchControls = new TouchControls(canvas, input);
const audio = new AudioManager();
const particles = new ParticleSystem();
const floatingText = new FloatingText();

const leaderboard = new Leaderboard(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentState = GameState.TITLE;
let titleScreen = new TitleScreen();
let gameOverScreen = new GameOverScreen();
let levelCompleteScreen = new LevelCompleteScreen();
let leaderboardPending = false; // true while waiting for name input or submission

let player = null;
let level = null;
let camera = null;
let hud = null;
let background = new BackgroundRenderer();

let levelTime = 0;
let gameTime = 0;
let debugMode = false;

// Death/respawn state
let deathPauseTimer = 0;
let marginCallShown = false;
let flashCrashTimer = 0;

// ==========================================
//  Canvas setup
// ==========================================
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function getScale() {
  const scaleX = canvas.width / CONFIG.VIRTUAL_WIDTH;
  const scaleY = canvas.height / CONFIG.VIRTUAL_HEIGHT;
  return Math.min(scaleX, scaleY);
}

// ==========================================
//  Game Start
// ==========================================
function startGame(characterType) {
  level = loadLevel(LEVEL_1);
  player = new Player(LEVEL_1.playerStart.x, LEVEL_1.playerStart.y, characterType);
  camera = new Camera(CONFIG.VIRTUAL_WIDTH, CONFIG.VIRTUAL_HEIGHT);
  camera.levelWidth = level.width;
  camera.levelHeight = level.height;
  hud = new HUD(level.tickerStocks);
  levelTime = 0;
  deathPauseTimer = 0;
  marginCallShown = false;
  leaderboardPending = false;
  leaderboard.resetSession();

  // Wire up question block callbacks
  for (const block of level.questionBlocks) {
    block.setHitCallback((contents, x, y) => {
      spawnFromBlock(contents, x, y);
      audio.playBlockHit();
    });
  }

  currentState = GameState.PLAYING;

  // Try to fetch live stock data
  fetchLiveStockData().then(stocks => {
    if (stocks) {
      level.tickerStocks = stocks;
      hud.tickerStocks = stocks;
    }
  });
}

function spawnFromBlock(contents, x, y) {
  if (contents === 'bull') {
    level.collectibles.push(new GoldBull(x, y));
  } else if (contents === 'hodlItem') {
    level.collectibles.push(new HodlItem(x, y));
  } else if (contents === 'greenCandle') {
    level.collectibles.push(new GreenCandle(x, y));
  }
}

// ==========================================
//  Main Update
// ==========================================
function update(dt) {
  gameTime += dt;

  // Debug mode toggle
  if (input.wasPressed('F1') || input.wasPressed('Backquote')) {
    debugMode = !debugMode;
  }

  switch (currentState) {
    case GameState.TITLE:
      updateTitle(dt);
      break;
    case GameState.PLAYING:
      updatePlaying(dt);
      break;
    case GameState.GAME_OVER:
      updateGameOver(dt);
      break;
    case GameState.LEVEL_COMPLETE:
      updateLevelComplete(dt);
      break;
  }

  input.clearFrameState();
  touchControls.update(dt, currentState);
}

function updateTitle(dt) {
  const result = titleScreen.update(dt, input);
  if (result === 'start') {
    audio.init();
    startGame(titleScreen.selectedCharacter);
  }
}

function updatePlaying(dt) {
  // Handle death pause
  if (deathPauseTimer > 0) {
    deathPauseTimer -= dt;
    if (player.deathAnimating) {
      player.update(dt, { left: false, right: false, jump: false }, []);
    }
    if (deathPauseTimer <= 0) {
      if (player.lives <= 0) {
        gameOverScreen = new GameOverScreen();
        gameOverScreen.finalScore = player.score;
        gameOverScreen.bullsCollected = player.totalBullsCollected;
        currentState = GameState.GAME_OVER;
        triggerLeaderboard(player.score, player.totalBullsCollected, levelTime, player.characterType);
      } else {
        player.respawn();
        camera.x = Math.max(0, player.x - CONFIG.VIRTUAL_WIDTH / 2);
        marginCallShown = false;
      }
    }
    particles.update(dt);
    floatingText.update(dt);
    return;
  }

  levelTime += dt;

  // Update player
  player.update(dt, input, level.solids);

  // Jump sounds
  if (player.superJumpedThisFrame) {
    audio.playSuperJump();
  } else if (player.jumpedThisFrame) {
    audio.playJump();
  }

  // Update question blocks
  for (const block of level.questionBlocks) {
    block.update(dt);
  }

  // Update enemies
  for (let i = level.enemies.length - 1; i >= 0; i--) {
    const enemy = level.enemies[i];
    const keepAlive = enemy instanceof GrizzlyBear
      ? enemy.update(dt, level.solids, player.x)
      : enemy.update(dt, level.solids);
    if (!keepAlive) {
      level.enemies.splice(i, 1);
    }
  }

  // Player vs enemies collision
  if (!player.deathAnimating) {
    for (const enemy of level.enemies) {
      if (!enemy.alive) continue;
      if (!aabbOverlap(player, enemy)) continue;

      // Check if Diamond Hands invincible - kill ALL enemies on contact
      if (player.invincible && player.diamondHands) {
        enemy.hp = 0;
        enemy.alive = false;
        particles.bearDeath(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        floatingText.spawn(enemy.x + enemy.width / 2, enemy.y - 20, '+200', CONFIG.COLORS.BULL_GOLD);
        player.score += 200;
        audio.playStomp();
        continue;
      }

      // Determine stomp vs side hit
      const playerBottom = player.y + player.height;
      const enemyTop = enemy.y;
      const playerFalling = player.vy > 0;

      if (playerFalling && (playerBottom - enemyTop) < enemy.height * 0.45) {
        // Grizzly bears are immune to stomping
        if (enemy instanceof GrizzlyBear) {
          player.vy = CONFIG.PLAYER_STOMP_BOUNCE;
          audio.playClang();
          floatingText.spawn(enemy.x + enemy.width / 2, enemy.y - 20, 'IMMUNE!', '#FF8800', 20);
        } else {
          // STOMP baby bears
          const killed = enemy.stomp();
          player.vy = CONFIG.PLAYER_STOMP_BOUNCE;
          audio.playStomp();

          if (killed) {
            particles.bearDeath(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            floatingText.spawn(enemy.x + enemy.width / 2, enemy.y - 20, '+200', CONFIG.COLORS.BULL_GOLD);
            player.score += 200;
          } else {
            floatingText.spawn(enemy.x + enemy.width / 2, enemy.y - 20, 'HIT!', CONFIG.COLORS.TICKER_RED, 18);
            player.score += 50;
          }
        }
      } else {
        // Side hit - player takes damage
        const died = player.takeDamage();
        if (died) {
          playerDeath('enemy');
        } else {
          audio.playDamage();
          floatingText.spawn(player.x + player.width / 2, player.y - 20, 'OUCH!', CONFIG.COLORS.TICKER_RED, 20);
          // Knockback
          player.vx = (player.x < enemy.x) ? -200 : 200;
          player.vy = -200;
        }
      }
    }
  }

  // Player vs collectibles
  for (let i = level.collectibles.length - 1; i >= 0; i--) {
    const c = level.collectibles[i];
    if (c.collected) continue;
    if (!aabbOverlap(player, c)) continue;

    c.collected = true;

    if (c.type === 'bull') {
      const result = player.collectBull();
      audio.playCollect();
      particles.bullCollect(c.x + c.width / 2, c.y + c.height / 2);
      floatingText.spawn(c.x + c.width / 2, c.y - 10, '+$100', CONFIG.COLORS.BULL_GOLD, 16);
      if (result === 'diamondHands') {
        audio.playDiamondHands();
        floatingText.spawn(player.x + player.width / 2, player.y - 40,
          'DIAMOND HANDS!', '#88DDFF', 28, 2.5);
        particles.powerUp(player.x + player.width / 2, player.y + player.height / 2, '#88DDFF');
      }
    } else if (c.type === 'hodlItem') {
      player.applyPowerUp('hodlItem');
      audio.playPowerUp();
      particles.powerUp(c.x + c.width / 2, c.y + c.height / 2, '#FF4444');
      floatingText.spawn(c.x + c.width / 2, c.y - 10, 'HODL!', '#FF4444', 22, 1.5);
    } else if (c.type === 'greenCandle') {
      player.applyPowerUp('greenCandle');
      audio.playPowerUp();
      particles.powerUp(c.x + c.width / 2, c.y + c.height / 2, CONFIG.COLORS.GREEN_CANDLE);
      floatingText.spawn(c.x + c.width / 2, c.y - 10, 'GREEN CANDLE!', CONFIG.COLORS.GREEN_CANDLE, 22, 1.5);
    } else if (c.type === 'dividend') {
      player.score += CONFIG.DIVIDEND_SCORE;
      audio.playDividend();
      particles.bullCollect(c.x + c.width / 2, c.y + c.height / 2);
      floatingText.spawn(c.x + c.width / 2, c.y - 10, '+$500 DIVIDEND!', '#00FF88', 24, 2.0);
    }
  }

  // Remove collected items
  level.collectibles = level.collectibles.filter(c => !c.collected);

  // Short Squeeze pads
  for (const pad of level.shortSqueezePads) {
    pad.update(dt);
    if (!player.deathAnimating && pad.tryLaunch(player)) {
      audio.playSuperJump();
      floatingText.spawn(pad.x + pad.width / 2, pad.y - 20, 'SHORT SQUEEZE!', '#00FF88', 20, 1.5);
      particles.powerUp(pad.x + pad.width / 2, pad.y, '#00FF88');
    }
  }

  // Red Candle falling hazards
  level.redCandleTimer = (level.redCandleTimer || 0) + dt;
  if (level.redCandleTimer >= 2.0) {
    level.redCandleTimer = 0;
    for (const zone of level.redCandleZones) {
      // Only spawn if player is within range of the zone
      if (Math.abs(player.x - zone.x - zone.width / 2) < CONFIG.VIRTUAL_WIDTH) {
        const rx = zone.x + Math.random() * zone.width;
        level.collectibles.push(new RedCandle(rx, player.y - CONFIG.VIRTUAL_HEIGHT / 2 - 50));
      }
    }
  }

  // Player vs red candles
  for (let i = level.collectibles.length - 1; i >= 0; i--) {
    const c = level.collectibles[i];
    if (c.type !== 'redCandle' || c.collected) continue;
    if (!player.deathAnimating && aabbOverlap(player, c)) {
      c.collected = true;
      const died = player.takeDamage();
      if (died) {
        playerDeath('enemy');
      } else {
        audio.playDamage();
        floatingText.spawn(player.x + player.width / 2, player.y - 20, 'RED CANDLE!', '#FF4444', 20);
        player.vx = (player.x < c.x) ? -150 : 150;
        player.vy = -150;
      }
    }
  }

  // Pit death
  if (!player.deathAnimating && player.y > CONFIG.VIRTUAL_HEIGHT + 50) {
    playerDeath('pit');
  }

  // Goal check
  const goal = level.goalPosition;
  if (!player.deathAnimating &&
      Math.abs(player.x + player.width / 2 - goal.x - 24) < 50 &&
      Math.abs(player.y + player.height / 2 - goal.y - 20) < 50) {
    audio.playLevelComplete();
    levelCompleteScreen = new LevelCompleteScreen();
    levelCompleteScreen.finalScore = player.score;
    levelCompleteScreen.bullsCollected = player.totalBullsCollected;
    levelCompleteScreen.timeTaken = levelTime;
    currentState = GameState.LEVEL_COMPLETE;
    triggerLeaderboard(player.score, player.totalBullsCollected, levelTime, player.characterType);
  }

  // Update camera
  if (!player.deathAnimating) {
    camera.follow(player, dt);
  }

  // Update collectibles animation
  for (const c of level.collectibles) c.update(dt);

  // Update particles
  particles.update(dt);
  floatingText.update(dt);

  // Update HUD
  hud.update(dt);
}

function playerDeath(cause) {
  flashCrashTimer = 0.3;
  if (cause === 'pit' && !marginCallShown) {
    marginCallShown = true;
    audio.playMarginCall();
    floatingText.spawn(player.x + player.width / 2, CONFIG.VIRTUAL_HEIGHT - 80 + camera.y,
      'MARGIN CALL!', CONFIG.COLORS.TICKER_RED, 36, 2.0);
  } else if (cause === 'enemy') {
    audio.playDeath();
  }
  player.die();
  deathPauseTimer = cause === 'pit' ? 1.5 : 2.0;
}

function triggerLeaderboard(score, bulls, time, character) {
  if (!leaderboard.isAvailable() || leaderboard.submittedThisSession) return;

  const screen = currentState === GameState.LEVEL_COMPLETE ? levelCompleteScreen : gameOverScreen;
  screen.leaderboardStatus = 'pending';
  leaderboardPending = true;

  const doSubmit = () => {
    screen.leaderboardStatus = 'submitting';
    leaderboard.submitScore(score, bulls, time, character).then(result => {
      leaderboardPending = false;
      if (result) {
        screen.leaderboardData = result.leaderboard;
        screen.playerRank = result.rank;
        screen.playerTotal = result.total;
        screen.leaderboardStatus = 'done';
      } else {
        screen.leaderboardStatus = 'error';
      }
    });
  };

  if (leaderboard.hasPlayerName()) {
    doSubmit();
  } else {
    leaderboard.showNameInput(
      (name) => { doSubmit(); },
      () => { leaderboardPending = false; screen.leaderboardStatus = 'skipped'; }
    );
  }
}

function updateGameOver(dt) {
  gameOverScreen.update(dt);
  if (leaderboardPending) return;
  if (input.wasPressed('Enter') || input.wasPressed('Space')) {
    titleScreen = new TitleScreen();
    currentState = GameState.TITLE;
  }
}

function updateLevelComplete(dt) {
  levelCompleteScreen.update(dt);
  if (leaderboardPending) return;
  if ((input.wasPressed('Enter') || input.wasPressed('Space')) && levelCompleteScreen.animTime > 2) {
    titleScreen = new TitleScreen();
    currentState = GameState.TITLE;
  }
}

// ==========================================
//  Main Render
// ==========================================
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const scale = getScale();
  const offsetX = (canvas.width - CONFIG.VIRTUAL_WIDTH * scale) / 2;
  const offsetY = (canvas.height - CONFIG.VIRTUAL_HEIGHT * scale) / 2;

  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Clip to virtual viewport
  ctx.beginPath();
  ctx.rect(0, 0, CONFIG.VIRTUAL_WIDTH, CONFIG.VIRTUAL_HEIGHT);
  ctx.clip();

  switch (currentState) {
    case GameState.TITLE:
      titleScreen.render(ctx, CONFIG.VIRTUAL_WIDTH, CONFIG.VIRTUAL_HEIGHT);
      break;

    case GameState.PLAYING:
      renderPlaying();
      break;

    case GameState.GAME_OVER:
      renderPlaying();
      gameOverScreen.render(ctx, CONFIG.VIRTUAL_WIDTH, CONFIG.VIRTUAL_HEIGHT);
      break;

    case GameState.LEVEL_COMPLETE:
      renderPlaying();
      levelCompleteScreen.render(ctx, CONFIG.VIRTUAL_WIDTH, CONFIG.VIRTUAL_HEIGHT);
      break;
  }

  ctx.restore();

  // Touch controls overlay (drawn in screen-space, outside game viewport transform)
  touchControls.render(ctx, canvas.width, canvas.height, currentState);
}

function renderPlaying() {
  // Background (parallax)
  background.render(ctx, camera, CONFIG.VIRTUAL_WIDTH, CONFIG.VIRTUAL_HEIGHT, gameTime);

  // Pit voids (draw dark areas where there's no ground)
  ctx.fillStyle = CONFIG.COLORS.PIT_VOID;
  ctx.fillRect(0, 432 - camera.y, CONFIG.VIRTUAL_WIDTH, CONFIG.VIRTUAL_HEIGHT);

  // Level geometry - only render visible solids
  const viewLeft = camera.x - 100;
  const viewRight = camera.x + CONFIG.VIRTUAL_WIDTH + 100;
  for (const solid of level.solids) {
    if (solid.x + solid.width > viewLeft && solid.x < viewRight) {
      solid.render(ctx, camera);
    }
  }

  // Golden Briefcase (goal)
  renderGoldenBriefcase(ctx, camera, level.goalPosition, gameTime);

  // Short Squeeze pads
  for (const pad of level.shortSqueezePads) {
    pad.render(ctx, camera);
  }

  // Collectibles
  for (const c of level.collectibles) {
    c.render(ctx, camera);
  }

  // Enemies
  for (const e of level.enemies) {
    e.render(ctx, camera);
  }

  // Player
  player.render(ctx, camera);

  // Particles and floating text
  particles.render(ctx, camera);
  floatingText.render(ctx, camera);

  // Flash Crash death effect
  if (flashCrashTimer > 0) {
    flashCrashTimer -= FIXED_DT;
    ctx.globalAlpha = Math.min(flashCrashTimer * 2, 0.5);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, CONFIG.VIRTUAL_WIDTH, CONFIG.VIRTUAL_HEIGHT);
    ctx.globalAlpha = Math.min(flashCrashTimer * 3, 1);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FLASH CRASH', CONFIG.VIRTUAL_WIDTH / 2, CONFIG.VIRTUAL_HEIGHT / 2);
    ctx.globalAlpha = 1;
  }

  // HUD (screen space)
  hud.render(ctx, player, CONFIG.VIRTUAL_WIDTH);

  // Debug overlay
  if (debugMode) {
    renderDebug();
  }
}

function renderDebug() {
  // Collision boxes
  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 1;

  const viewLeft = camera.x - 100;
  const viewRight = camera.x + CONFIG.VIRTUAL_WIDTH + 100;

  for (const solid of level.solids) {
    if (solid.x + solid.width > viewLeft && solid.x < viewRight) {
      ctx.strokeRect(solid.x - camera.x, solid.y - camera.y, solid.width, solid.height);
    }
  }

  // Player hitbox
  ctx.strokeStyle = 'cyan';
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x - camera.x, player.y - camera.y, player.width, player.height);

  // Enemy hitboxes
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  for (const e of level.enemies) {
    if (e.alive) {
      ctx.strokeRect(e.x - camera.x, e.y - camera.y, e.width, e.height);
    }
  }

  // Collectible hitboxes
  ctx.strokeStyle = 'yellow';
  for (const c of level.collectibles) {
    ctx.strokeRect(c.x - camera.x, c.y - camera.y, c.width, c.height);
  }

  // Goal hitbox
  ctx.strokeStyle = 'magenta';
  ctx.lineWidth = 2;
  ctx.strokeRect(level.goalPosition.x - camera.x, level.goalPosition.y - camera.y, 48, 48);

  // Info
  ctx.fillStyle = 'lime';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Player: ' + Math.round(player.x) + ', ' + Math.round(player.y) +
    ' | vx: ' + Math.round(player.vx) + ' vy: ' + Math.round(player.vy) +
    ' | ground: ' + player.onGround, 10, CONFIG.VIRTUAL_HEIGHT - 30);
  ctx.fillText('Camera: ' + Math.round(camera.x) + ', ' + Math.round(camera.y) +
    ' | Enemies: ' + level.enemies.length +
    ' | Bulls: ' + level.collectibles.length, 10, CONFIG.VIRTUAL_HEIGHT - 16);
}

// ==========================================
//  Live Stock Ticker (Dow 30)
// ==========================================
async function fetchLiveStockData() {
  const DOW30 = ['AAPL','MSFT','AMGN','AXP','BA','CAT','CRM','CSCO','CVX','DIS',
    'GS','HD','HON','IBM','JNJ','JPM','KO','MCD','MMM','MRK',
    'NKE','PG','TRV','UNH','V','VZ','WBA','WMT','DOW','INTC'];

  try {
    // Try Yahoo Finance via CORS proxy
    const symbols = DOW30.join(',');
    const url = 'https://api.allorigins.win/get?url=' +
      encodeURIComponent('https://query1.finance.yahoo.com/v7/finance/quote?symbols=' + symbols + '&fields=symbol,regularMarketPrice,regularMarketChangePercent');

    const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const json = await resp.json();
    const data = JSON.parse(json.contents);

    if (data.quoteResponse && data.quoteResponse.result) {
      const stocks = data.quoteResponse.result.map(q => ({
        symbol: q.symbol,
        price: q.regularMarketPrice || 0,
        change: q.regularMarketChangePercent || 0
      }));
      if (stocks.length > 10) {
        return stocks;
      }
    }
  } catch (e) {
    console.warn('Live stock data unavailable, using fallback:', e.message);
  }
  return null; // Use fallback data from level
}

// Try to load live data on page load
fetchLiveStockData().then(stocks => {
  if (stocks && level) {
    level.tickerStocks = stocks;
    if (hud) hud.tickerStocks = stocks;
  }
});

// ==========================================
//  Game Loop
// ==========================================
const FIXED_DT = 1 / 60;
let accumulator = 0;
let lastTime = 0;

function gameLoop(timestamp) {
  if (lastTime === 0) lastTime = timestamp;

  let dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Cap delta to prevent spiral of death
  if (dt > 0.1) dt = 0.1;

  accumulator += dt;

  // Fixed timestep physics updates
  while (accumulator >= FIXED_DT) {
    update(FIXED_DT);
    accumulator -= FIXED_DT;
  }

  render();
  requestAnimationFrame(gameLoop);
}

// ==========================================
//  Start!
// ==========================================
requestAnimationFrame(gameLoop);
