// LEVEL DESIGN REFERENCE:
// Ground surface:  y = 432
// Player on ground: y = 378 (432 - 54 height)
// Player head on ground: y = 378
// Question blocks should be at y <= 320 so player (54px tall) can walk under
// Block bottom at y+48, so block at y=320 has bottom at 368 — player at 378 can walk under
// Platforms are optional elevated areas, NOT on the ground path unless intentional
// Pits: gaps between ground segments

const LEVEL_1 = {
  name: "Wall Street",
  playerStart: { x: 96, y: 370 },
  goalPosition: { x: 9300, y: 380 },

  // Stock ticker entries
  tickerStocks: [
    { symbol: 'YOLO', price: 420.69, change: 12.5 },
    { symbol: 'HODL', price: 1337.00, change: -4.2 },
    { symbol: 'FOMO', price: 99.99, change: 8.1 },
    { symbol: 'MOON', price: 256.00, change: 42.0 },
    { symbol: 'DOGE', price: 0.69, change: 100.0 },
    { symbol: 'BRUH', price: 13.37, change: -15.3 },
    { symbol: 'NGMI', price: 0.01, change: -99.0 },
    { symbol: 'WAGMI', price: 888.88, change: 25.5 },
    { symbol: 'CHAD', price: 9001.00, change: 0.1 },
    { symbol: 'REKT', price: 0.00, change: -100.0 },
    { symbol: 'APE', price: 42.00, change: 69.0 },
    { symbol: 'STNK', price: 123.45, change: -7.8 },
    { symbol: 'PUMP', price: 777.77, change: 33.3 },
    { symbol: 'DUMP', price: 1.23, change: -88.8 },
  ],

  // Ground segments: { x, width } - gaps between segments are pits
  // Ground surface is at y=432. Gaps between these = death pits.
  groundSegments: [
    // Section 1: Tutorial (0 - 1500) — long flat ground to learn controls
    { x: 0, width: 1500 },
    // Pit 1 (width=144, from 1500 to 1644)
    // Section 2: Post-tutorial (1644 - 2640)
    { x: 1644, width: 996 },
    // Pit 2 (width=144, from 2640 to 2784)
    // Section 3: Mid-level (2784 - 3600)
    { x: 2784, width: 816 },
    // Pit 3 (width=192, from 3600 to 3792)
    // Section 4: Challenge area (3792 - 5100)
    { x: 3792, width: 1308 },
    // Pit 4 (width=144)
    // Section 5: Double pit area
    { x: 5244, width: 480 },
    // Pit 5 (width=192)
    { x: 5916, width: 576 },
    // Pit 6 (width=144)
    // Section 6: Peak difficulty (6636 - 7500)
    { x: 6636, width: 864 },
    // Pit 7 (width=192)
    // Section 7: Victory run (7692 - 9600)
    { x: 7692, width: 1908 },
  ],

  // Floating platforms: above ground, player can jump up to them
  // These should NOT block the ground-level path
  platforms: [
    // == TUTORIAL AREA (0-1500) ==
    // Elevated platforms to teach jumping — off to the side of the main path
    { x: 350, y: 340, w: 144, h: 16, type: 'desk' },
    { x: 600, y: 290, w: 144, h: 16, type: 'desk' },
    { x: 880, y: 240, w: 96, h: 16, type: 'ledge' },
    { x: 1150, y: 310, w: 144, h: 16, type: 'desk' },

    // == OVER PIT 1 ==
    // Stepping stone over the pit
    { x: 1520, y: 390, w: 96, h: 16, type: 'taxi' },

    // == SECTION 2 (1644-2640) ==
    { x: 1800, y: 340, w: 144, h: 16, type: 'desk' },
    { x: 2050, y: 280, w: 120, h: 16, type: 'ledge' },
    { x: 2300, y: 320, w: 144, h: 16, type: 'desk' },

    // == OVER PIT 2 ==
    { x: 2660, y: 380, w: 96, h: 16, type: 'taxi' },

    // == SECTION 3 (2784-3600) ==
    { x: 2900, y: 340, w: 120, h: 16, type: 'desk' },
    { x: 3100, y: 280, w: 96, h: 16, type: 'ledge' },
    { x: 3300, y: 230, w: 120, h: 16, type: 'ledge' },
    { x: 3480, y: 320, w: 96, h: 16, type: 'desk' },

    // == OVER PIT 3 ==
    { x: 3630, y: 370, w: 120, h: 16, type: 'taxi' },

    // == SECTION 4: CHALLENGE (3792-5100) ==
    { x: 3950, y: 340, w: 144, h: 16, type: 'desk' },
    { x: 4200, y: 280, w: 120, h: 16, type: 'ledge' },
    { x: 4450, y: 220, w: 144, h: 16, type: 'ledge' },
    { x: 4700, y: 310, w: 120, h: 16, type: 'desk' },
    { x: 4950, y: 260, w: 96, h: 16, type: 'ledge' },

    // == OVER PIT 4 ==
    { x: 5130, y: 380, w: 96, h: 16, type: 'taxi' },

    // == SECTION 5: DOUBLE PIT ==
    { x: 5350, y: 340, w: 96, h: 16, type: 'desk' },
    // Over pit 5
    { x: 5760, y: 370, w: 120, h: 16, type: 'taxi' },
    // Section between pit 5 and 6
    { x: 6050, y: 330, w: 96, h: 16, type: 'desk' },
    // Over pit 6
    { x: 6530, y: 380, w: 96, h: 16, type: 'taxi' },

    // == SECTION 6: PEAK DIFFICULTY ==
    { x: 6750, y: 340, w: 96, h: 16, type: 'ledge' },
    { x: 6950, y: 280, w: 72, h: 16, type: 'ledge' },
    { x: 7150, y: 220, w: 96, h: 16, type: 'ledge' },
    { x: 7350, y: 300, w: 72, h: 16, type: 'desk' },

    // == OVER PIT 7 ==
    { x: 7550, y: 370, w: 120, h: 16, type: 'taxi' },

    // == SECTION 7: VICTORY RUN ==
    { x: 7900, y: 350, w: 192, h: 16, type: 'desk' },
    { x: 8200, y: 300, w: 144, h: 16, type: 'ledge' },
    { x: 8500, y: 340, w: 192, h: 16, type: 'desk' },
    { x: 8800, y: 280, w: 144, h: 16, type: 'ledge' },
    { x: 9100, y: 320, w: 144, h: 16, type: 'desk' },
  ],

  // Question blocks: floating above ground level, player can walk UNDER them
  // Block is 48x48. At y=320, bottom edge = 368. Player head at ~378. Gap = 10px ✓
  // Better: y=300 → bottom=348, gap to head=30px ✓✓
  // Best for walkability: y=280 → bottom=328, gap to head=50px ✓✓✓
  questionBlocks: [
    // Tutorial — floating above the ground path
    { x: 300, y: 280, contents: 'bull' },
    { x: 348, y: 280, contents: 'bull' },
    { x: 396, y: 280, contents: 'greenCandle' },

    // Above elevated platform area
    { x: 620, y: 190, contents: 'bull' },

    // Section 2
    { x: 1900, y: 240, contents: 'bull' },
    { x: 1948, y: 240, contents: 'bull' },
    { x: 2150, y: 180, contents: 'greenCandle' },

    // Challenge area
    { x: 4050, y: 240, contents: 'bull' },
    { x: 4098, y: 240, contents: 'bull' },
    { x: 4146, y: 240, contents: 'chargingBull' },

    // Peak difficulty reward
    { x: 7000, y: 180, contents: 'greenCandle' },

    // Victory run
    { x: 8050, y: 250, contents: 'bull' },
    { x: 8098, y: 250, contents: 'bull' },
    { x: 8550, y: 240, contents: 'bull' },
    { x: 9150, y: 220, contents: 'chargingBull' },
  ],

  // Enemies on ground: y should be groundY - enemyHeight
  // BabyBear: 36px tall → y = 432 - 36 = 396
  // GrizzlyBear: 54px tall → y = 432 - 54 = 378
  enemies: [
    // Tutorial — single easy bear (well after start, gives room to learn)
    { type: 'baby', x: 500, y: 396, patrolLeft: 400, patrolRight: 750 },

    // More bears
    { type: 'baby', x: 950, y: 396, patrolLeft: 850, patrolRight: 1150 },
    { type: 'baby', x: 1300, y: 396, patrolLeft: 1200, patrolRight: 1480 },

    // Section 2
    { type: 'baby', x: 1800, y: 396, patrolLeft: 1650, patrolRight: 2000 },
    { type: 'baby', x: 2200, y: 396, patrolLeft: 2100, patrolRight: 2450 },

    // First grizzly!
    { type: 'grizzly', x: 2500, y: 378, patrolLeft: 2350, patrolRight: 2620 },

    // Section 3
    { type: 'baby', x: 2900, y: 396, patrolLeft: 2800, patrolRight: 3100 },
    { type: 'baby', x: 3350, y: 396, patrolLeft: 3200, patrolRight: 3550 },

    // Challenge area
    { type: 'baby', x: 3900, y: 396, patrolLeft: 3800, patrolRight: 4100 },
    { type: 'baby', x: 4400, y: 396, patrolLeft: 4300, patrolRight: 4600 },
    { type: 'grizzly', x: 4800, y: 378, patrolLeft: 4650, patrolRight: 5050 },

    // Peak difficulty
    { type: 'baby', x: 6750, y: 396, patrolLeft: 6650, patrolRight: 6950 },
    { type: 'grizzly', x: 7100, y: 378, patrolLeft: 6950, patrolRight: 7350 },
    { type: 'baby', x: 7350, y: 396, patrolLeft: 7250, patrolRight: 7480 },

    // Victory run — lighter
    { type: 'baby', x: 7900, y: 396, patrolLeft: 7700, patrolRight: 8100 },
    { type: 'baby', x: 8400, y: 396, patrolLeft: 8300, patrolRight: 8600 },

    // On elevated platforms (y = platform.y - bearHeight)
    { type: 'baby', x: 620, y: 254, patrolLeft: 600, patrolRight: 744 },
    { type: 'baby', x: 4220, y: 244, patrolLeft: 4200, patrolRight: 4320 },
    { type: 'baby', x: 8220, y: 264, patrolLeft: 8200, patrolRight: 8344 },
  ],

  // Collectible bulls: floating at various heights
  // Ground level bulls: y ≈ 400 (above ground, player walks through them)
  // Platform bulls: y = platform.y - 30 or so
  bulls: [
    // Tutorial — line of bulls on ground
    { x: 150, y: 400 }, { x: 185, y: 400 }, { x: 220, y: 400 }, { x: 255, y: 400 },

    // On first desk platform
    { x: 370, y: 308 }, { x: 405, y: 308 }, { x: 440, y: 308 },

    // Arc in air (jumping reward)
    { x: 520, y: 340 }, { x: 560, y: 320 }, { x: 600, y: 300 },
    { x: 640, y: 320 }, { x: 680, y: 340 },

    // High platform reward
    { x: 890, y: 208 }, { x: 930, y: 208 },

    // Before pit 1 — guide to jump
    { x: 1460, y: 360 }, { x: 1500, y: 340 }, { x: 1540, y: 340 }, { x: 1580, y: 360 },

    // Section 2 ground
    { x: 1700, y: 400 }, { x: 1735, y: 400 }, { x: 1770, y: 400 },

    // On section 2 platforms
    { x: 1820, y: 308 }, { x: 1855, y: 308 },
    { x: 2070, y: 248 }, { x: 2110, y: 248 },

    // Before pit 2
    { x: 2610, y: 360 }, { x: 2650, y: 340 }, { x: 2690, y: 340 }, { x: 2730, y: 360 },

    // Section 3
    { x: 2850, y: 400 }, { x: 2885, y: 400 },
    { x: 3120, y: 248 }, { x: 3160, y: 248 },
    { x: 3320, y: 198 }, { x: 3360, y: 198 },

    // Before pit 3
    { x: 3560, y: 360 }, { x: 3600, y: 340 }, { x: 3660, y: 340 }, { x: 3700, y: 360 },

    // Challenge area
    { x: 3850, y: 400 }, { x: 3885, y: 400 }, { x: 3920, y: 400 },
    { x: 4220, y: 248 }, { x: 4260, y: 248 },
    { x: 4470, y: 188 }, { x: 4510, y: 188 }, { x: 4550, y: 188 },
    { x: 4720, y: 278 }, { x: 4760, y: 278 },

    // Before pit 4
    { x: 5100, y: 360 }, { x: 5150, y: 350 }, { x: 5200, y: 360 },

    // Double pit sections
    { x: 5300, y: 400 }, { x: 5380, y: 308 },
    { x: 5780, y: 340 }, { x: 5820, y: 340 },
    { x: 5960, y: 400 }, { x: 6000, y: 400 },

    // Peak difficulty rewards
    { x: 6700, y: 400 }, { x: 6735, y: 400 },
    { x: 6770, y: 308 },
    { x: 6970, y: 248 }, { x: 7010, y: 248 },
    { x: 7170, y: 188 }, { x: 7210, y: 188 }, { x: 7250, y: 188 },

    // Victory run — generous bulls
    { x: 7750, y: 400 }, { x: 7785, y: 400 }, { x: 7820, y: 400 }, { x: 7855, y: 400 },
    { x: 7920, y: 318 }, { x: 7960, y: 318 }, { x: 8000, y: 318 },
    { x: 8220, y: 268 }, { x: 8260, y: 268 }, { x: 8300, y: 268 },
    { x: 8520, y: 308 }, { x: 8560, y: 308 },
    { x: 8820, y: 248 }, { x: 8860, y: 248 },
    { x: 9120, y: 288 }, { x: 9160, y: 288 },

    // Final approach to goal
    { x: 9220, y: 370 }, { x: 9255, y: 360 }, { x: 9280, y: 350 },
  ],
};

function loadLevel(levelData) {
  const groundY = 432;
  const groundH = CONFIG.VIRTUAL_HEIGHT - groundY + 200;

  const level = {
    width: 9600,
    height: CONFIG.VIRTUAL_HEIGHT + 200,
    solids: [],
    platforms: [],
    questionBlocks: [],
    enemies: [],
    collectibles: [],
    goalPosition: { ...levelData.goalPosition },
    tickerStocks: levelData.tickerStocks,
    name: levelData.name,
  };

  // Create ground platforms from segments
  for (const seg of levelData.groundSegments) {
    const ground = new Platform(seg.x, groundY, seg.width, groundH, 'ground');
    level.solids.push(ground);
    level.platforms.push(ground);
  }

  // Add floating platforms
  for (const p of levelData.platforms) {
    const plat = new Platform(p.x, p.y, p.w, p.h, p.type);
    level.solids.push(plat);
    level.platforms.push(plat);
  }

  // Add question blocks
  for (const qb of levelData.questionBlocks) {
    const block = new QuestionBlock(qb.x, qb.y, qb.contents);
    level.questionBlocks.push(block);
    level.solids.push(block);
  }

  // Add enemies
  for (const e of levelData.enemies) {
    if (e.type === 'baby') {
      level.enemies.push(new BabyBear(e.x, e.y, e.patrolLeft, e.patrolRight));
    } else if (e.type === 'grizzly') {
      level.enemies.push(new GrizzlyBear(e.x, e.y, e.patrolLeft, e.patrolRight));
    }
  }

  // Add collectible bulls
  for (const b of levelData.bulls) {
    level.collectibles.push(new GoldBull(b.x, b.y));
  }

  return level;
}
