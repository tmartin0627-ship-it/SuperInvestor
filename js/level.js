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

  // Dow 30 stock ticker — fallback data (overridden by live API fetch if available)
  tickerStocks: [
    { symbol: 'AAPL', price: 232.47, change: 1.2 },
    { symbol: 'MSFT', price: 415.30, change: 0.8 },
    { symbol: 'AMGN', price: 313.55, change: -0.4 },
    { symbol: 'AXP', price: 298.10, change: 1.5 },
    { symbol: 'BA', price: 178.42, change: -1.1 },
    { symbol: 'CAT', price: 362.80, change: 0.6 },
    { symbol: 'CRM', price: 332.15, change: 1.9 },
    { symbol: 'CSCO', price: 58.73, change: 0.3 },
    { symbol: 'CVX', price: 155.60, change: -0.7 },
    { symbol: 'DIS', price: 112.88, change: 2.1 },
    { symbol: 'GS', price: 598.45, change: 0.9 },
    { symbol: 'HD', price: 388.20, change: -0.3 },
    { symbol: 'HON', price: 210.35, change: 0.4 },
    { symbol: 'IBM', price: 228.90, change: 1.1 },
    { symbol: 'JNJ', price: 152.44, change: -0.2 },
    { symbol: 'JPM', price: 252.68, change: 1.3 },
    { symbol: 'KO', price: 61.35, change: 0.5 },
    { symbol: 'MCD', price: 295.80, change: -0.6 },
    { symbol: 'MMM', price: 135.22, change: 2.4 },
    { symbol: 'MRK', price: 99.15, change: -1.8 },
    { symbol: 'NKE', price: 71.50, change: -2.3 },
    { symbol: 'PG', price: 168.92, change: 0.7 },
    { symbol: 'TRV', price: 258.40, change: 1.0 },
    { symbol: 'UNH', price: 528.75, change: -0.5 },
    { symbol: 'V', price: 318.60, change: 1.4 },
    { symbol: 'VZ', price: 40.88, change: 0.2 },
    { symbol: 'WBA', price: 10.25, change: -3.5 },
    { symbol: 'WMT', price: 92.44, change: 0.8 },
    { symbol: 'DOW', price: 42.30, change: -1.2 },
    { symbol: 'INTC', price: 20.15, change: -2.8 },
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
    { x: 356, y: 280, contents: 'bull' },
    { x: 412, y: 280, contents: 'hodlItem' },

    // Above elevated platform area
    { x: 620, y: 210, contents: 'bull' },

    // Section 2
    { x: 1900, y: 240, contents: 'bull' },
    { x: 1956, y: 240, contents: 'bull' },
    { x: 2150, y: 220, contents: 'hodlItem' },

    // Challenge area
    { x: 4050, y: 240, contents: 'bull' },
    { x: 4106, y: 240, contents: 'bull' },
    { x: 4162, y: 240, contents: 'hodlItem' },

    // Peak difficulty reward
    { x: 7000, y: 220, contents: 'hodlItem' },

    // Victory run
    { x: 8050, y: 250, contents: 'bull' },
    { x: 8106, y: 250, contents: 'bull' },
    { x: 8550, y: 240, contents: 'bull' },
    { x: 9150, y: 220, contents: 'bull' },
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

  // Short Squeeze jump pads: { x, y } — placed on ground level (y=432-16=416)
  shortSqueezePads: [
    { x: 1470, y: 416 },   // Before pit 1 — helps clear it
    { x: 3570, y: 416 },   // Before pit 3 — reach high platform
    { x: 5200, y: 416 },   // Before pit 4 area
    { x: 7650, y: 416 },   // Before pit 7 — launch into victory run
  ],

  // Red Candle danger zones: { x, width } — red candles fall periodically in these areas
  redCandleZones: [
    { x: 2900, width: 400 },   // Section 3 danger
    { x: 4600, width: 500 },   // Challenge area danger
    { x: 6700, width: 400 },   // Peak difficulty danger
  ],

  // Dividend bonus coins: rare high-value collectibles (500pts each)
  dividendCoins: [
    { x: 900, y: 200 },    // High above tutorial area — hard to reach
    { x: 3330, y: 190 },   // Above high ledge in section 3
    { x: 4480, y: 180 },   // Above high ledge in challenge area
    { x: 7180, y: 180 },   // Peak difficulty high reward
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

const LEVEL_2 = {
  name: "The Trading Floor",
  theme: 'tradingFloor',
  width: 12000,
  playerStart: { x: 96, y: 370 },
  goalPosition: { x: 11700, y: 380 },

  tickerStocks: [
    { symbol: 'AAPL', price: 232.47, change: 1.2 },
    { symbol: 'MSFT', price: 415.30, change: 0.8 },
    { symbol: 'AMGN', price: 313.55, change: -0.4 },
    { symbol: 'AXP', price: 298.10, change: 1.5 },
    { symbol: 'BA', price: 178.42, change: -1.1 },
    { symbol: 'CAT', price: 362.80, change: 0.6 },
    { symbol: 'CRM', price: 332.15, change: 1.9 },
    { symbol: 'CSCO', price: 58.73, change: 0.3 },
    { symbol: 'CVX', price: 155.60, change: -0.7 },
    { symbol: 'DIS', price: 112.88, change: 2.1 },
    { symbol: 'GS', price: 598.45, change: 0.9 },
    { symbol: 'HD', price: 388.20, change: -0.3 },
    { symbol: 'HON', price: 210.35, change: 0.4 },
    { symbol: 'IBM', price: 228.90, change: 1.1 },
    { symbol: 'JNJ', price: 152.44, change: -0.2 },
    { symbol: 'JPM', price: 252.68, change: 1.3 },
    { symbol: 'KO', price: 61.35, change: 0.5 },
    { symbol: 'MCD', price: 295.80, change: -0.6 },
    { symbol: 'MMM', price: 135.22, change: 2.4 },
    { symbol: 'MRK', price: 99.15, change: -1.8 },
    { symbol: 'NKE', price: 71.50, change: -2.3 },
    { symbol: 'PG', price: 168.92, change: 0.7 },
    { symbol: 'TRV', price: 258.40, change: 1.0 },
    { symbol: 'UNH', price: 528.75, change: -0.5 },
    { symbol: 'V', price: 318.60, change: 1.4 },
    { symbol: 'VZ', price: 40.88, change: 0.2 },
    { symbol: 'WBA', price: 10.25, change: -3.5 },
    { symbol: 'WMT', price: 92.44, change: 0.8 },
    { symbol: 'DOW', price: 42.30, change: -1.2 },
    { symbol: 'INTC', price: 20.15, change: -2.8 },
  ],

  // 10 ground segments with wider/more pits — total covering 12000px
  groundSegments: [
    // Section 1: Entrance lobby (0-1200) — learn the new environment
    { x: 0, width: 1200 },
    // Pit 1 (width=168, from 1200 to 1368)
    // Section 2: First trading desks (1368-2280)
    { x: 1368, width: 912 },
    // Pit 2 (width=192, from 2280 to 2472)
    // Section 3: Terminal banks (2472-3360)
    { x: 2472, width: 888 },
    // Pit 3 (width=216, from 3360 to 3576) — wider
    // Section 4: The Pit (trading pit) (3576-4680)
    { x: 3576, width: 1104 },
    // Pit 4 (width=192, from 4680 to 4872)
    // Section 5: Short island (4872-5280)
    { x: 4872, width: 408 },
    // Pit 5 (width=240, from 5280 to 5520) — wide pit
    // Section 6: Recovery zone (5520-6360)
    { x: 5520, width: 840 },
    // Pit 6 (width=168, from 6360 to 6528)
    // Section 7: High-frequency zone (6528-7680)
    { x: 6528, width: 1152 },
    // Pit 7 (width=216, from 7680 to 7896)
    // Section 8: Another short island (7896-8280)
    { x: 7896, width: 384 },
    // Pit 8 (width=192, from 8280 to 8472)
    // Section 9: Executive row (8472-10200)
    { x: 8472, width: 1728 },
    // Pit 9 (width=240, from 10200 to 10440) — widest pit
    // Section 10: Final run to goal (10440-12000)
    { x: 10440, width: 1560 },
  ],

  // ~50 floating platforms using desk, terminal, column types
  platforms: [
    // == ENTRANCE LOBBY (0-1200) ==
    { x: 300, y: 340, w: 144, h: 16, type: 'desk' },
    { x: 550, y: 290, w: 120, h: 16, type: 'terminal' },
    { x: 800, y: 250, w: 96, h: 16, type: 'column' },
    { x: 1050, y: 320, w: 144, h: 16, type: 'desk' },

    // == OVER PIT 1 ==
    { x: 1240, y: 380, w: 96, h: 16, type: 'terminal' },

    // == SECTION 2: FIRST TRADING DESKS (1368-2280) ==
    { x: 1500, y: 340, w: 144, h: 16, type: 'desk' },
    { x: 1720, y: 280, w: 120, h: 16, type: 'terminal' },
    { x: 1950, y: 240, w: 96, h: 16, type: 'column' },
    { x: 2100, y: 310, w: 144, h: 16, type: 'desk' },

    // == OVER PIT 2 ==
    { x: 2330, y: 370, w: 96, h: 16, type: 'terminal' },

    // == SECTION 3: TERMINAL BANKS (2472-3360) ==
    { x: 2600, y: 340, w: 120, h: 16, type: 'terminal' },
    { x: 2800, y: 280, w: 96, h: 16, type: 'column' },
    { x: 2980, y: 230, w: 120, h: 16, type: 'terminal' },
    { x: 3150, y: 300, w: 144, h: 16, type: 'desk' },

    // == OVER PIT 3 (wider) ==
    { x: 3400, y: 360, w: 96, h: 16, type: 'terminal' },
    { x: 3500, y: 320, w: 72, h: 16, type: 'column' },

    // == SECTION 4: THE PIT (3576-4680) ==
    { x: 3700, y: 350, w: 144, h: 16, type: 'desk' },
    { x: 3920, y: 290, w: 120, h: 16, type: 'terminal' },
    { x: 4100, y: 240, w: 96, h: 16, type: 'column' },
    { x: 4280, y: 200, w: 120, h: 16, type: 'terminal' },
    { x: 4450, y: 260, w: 144, h: 16, type: 'desk' },
    { x: 4600, y: 320, w: 96, h: 16, type: 'terminal' },

    // == OVER PIT 4 ==
    { x: 4730, y: 380, w: 96, h: 16, type: 'desk' },

    // == SECTION 5: SHORT ISLAND (4872-5280) ==
    { x: 4950, y: 340, w: 96, h: 16, type: 'terminal' },
    { x: 5100, y: 280, w: 120, h: 16, type: 'column' },

    // == OVER PIT 5 (wide) ==
    { x: 5320, y: 370, w: 72, h: 16, type: 'terminal' },
    { x: 5430, y: 330, w: 72, h: 16, type: 'column' },

    // == SECTION 6: RECOVERY ZONE (5520-6360) ==
    { x: 5650, y: 350, w: 144, h: 16, type: 'desk' },
    { x: 5880, y: 290, w: 120, h: 16, type: 'terminal' },
    { x: 6050, y: 240, w: 96, h: 16, type: 'column' },
    { x: 6200, y: 310, w: 144, h: 16, type: 'desk' },

    // == OVER PIT 6 ==
    { x: 6400, y: 380, w: 96, h: 16, type: 'terminal' },

    // == SECTION 7: HIGH-FREQUENCY ZONE (6528-7680) ==
    { x: 6650, y: 340, w: 96, h: 16, type: 'terminal' },
    { x: 6830, y: 280, w: 72, h: 16, type: 'column' },
    { x: 6970, y: 230, w: 96, h: 16, type: 'terminal' },
    { x: 7130, y: 280, w: 72, h: 16, type: 'column' },
    { x: 7280, y: 340, w: 120, h: 16, type: 'desk' },
    { x: 7450, y: 250, w: 96, h: 16, type: 'terminal' },
    { x: 7580, y: 310, w: 120, h: 16, type: 'desk' },

    // == OVER PIT 7 ==
    { x: 7730, y: 370, w: 96, h: 16, type: 'terminal' },
    { x: 7830, y: 330, w: 72, h: 16, type: 'column' },

    // == SECTION 8: SHORT ISLAND (7896-8280) ==
    { x: 7960, y: 290, w: 120, h: 16, type: 'desk' },
    { x: 8130, y: 340, w: 96, h: 16, type: 'terminal' },

    // == OVER PIT 8 ==
    { x: 8330, y: 380, w: 96, h: 16, type: 'desk' },

    // == SECTION 9: EXECUTIVE ROW (8472-10200) ==
    { x: 8600, y: 340, w: 192, h: 16, type: 'desk' },
    { x: 8900, y: 280, w: 144, h: 16, type: 'terminal' },
    { x: 9230, y: 230, w: 120, h: 16, type: 'column' },
    { x: 9400, y: 290, w: 144, h: 16, type: 'desk' },
    { x: 9700, y: 340, w: 120, h: 16, type: 'terminal' },
    { x: 9950, y: 260, w: 96, h: 16, type: 'column' },

    // == OVER PIT 9 (widest) ==
    { x: 10250, y: 360, w: 96, h: 16, type: 'terminal' },
    { x: 10360, y: 310, w: 72, h: 16, type: 'column' },

    // == SECTION 10: FINAL RUN (10440-12000) ==
    { x: 10600, y: 340, w: 144, h: 16, type: 'desk' },
    { x: 10850, y: 300, w: 120, h: 16, type: 'terminal' },
    { x: 11100, y: 260, w: 144, h: 16, type: 'desk' },
    { x: 11350, y: 320, w: 120, h: 16, type: 'terminal' },
    { x: 11550, y: 280, w: 144, h: 16, type: 'desk' },
  ],

  // 15 question blocks
  questionBlocks: [
    // Entrance area
    { x: 320, y: 240, contents: 'bull' },
    { x: 376, y: 240, contents: 'hodlItem' },

    // Section 2
    { x: 1540, y: 240, contents: 'bull' },
    { x: 1596, y: 240, contents: 'bull' },

    // Section 3
    { x: 2640, y: 240, contents: 'hodlItem' },
    { x: 2840, y: 220, contents: 'bull' },

    // Section 4 — The Pit
    { x: 3940, y: 220, contents: 'bull' },
    { x: 3996, y: 220, contents: 'bull' },
    { x: 4120, y: 180, contents: 'hodlItem' },

    // Section 6
    { x: 5900, y: 220, contents: 'bull' },
    { x: 5956, y: 220, contents: 'bull' },

    // Section 7
    { x: 6990, y: 170, contents: 'hodlItem' },
    { x: 7470, y: 180, contents: 'bull' },

    // Executive row
    { x: 9170, y: 170, contents: 'hodlItem' },
    { x: 9970, y: 200, contents: 'bull' },
  ],

  // ~20 enemies — more grizzlies than Level 1
  enemies: [
    // Entrance lobby
    { type: 'baby', x: 400, y: 396, patrolLeft: 300, patrolRight: 600 },
    { type: 'baby', x: 850, y: 396, patrolLeft: 750, patrolRight: 1050 },
    { type: 'grizzly', x: 1100, y: 378, patrolLeft: 1000, patrolRight: 1190 },

    // Section 2
    { type: 'baby', x: 1550, y: 396, patrolLeft: 1380, patrolRight: 1750 },
    { type: 'grizzly', x: 2000, y: 378, patrolLeft: 1850, patrolRight: 2200 },

    // Section 3
    { type: 'baby', x: 2600, y: 396, patrolLeft: 2480, patrolRight: 2800 },
    { type: 'grizzly', x: 3100, y: 378, patrolLeft: 2950, patrolRight: 3300 },
    { type: 'baby', x: 3250, y: 396, patrolLeft: 3150, patrolRight: 3350 },

    // Section 4 — The Pit (toughest)
    { type: 'grizzly', x: 3800, y: 378, patrolLeft: 3600, patrolRight: 4000 },
    { type: 'baby', x: 4200, y: 396, patrolLeft: 4100, patrolRight: 4400 },
    { type: 'grizzly', x: 4500, y: 378, patrolLeft: 4350, patrolRight: 4660 },

    // Section 6
    { type: 'baby', x: 5700, y: 396, patrolLeft: 5530, patrolRight: 5900 },
    { type: 'grizzly', x: 6100, y: 378, patrolLeft: 5950, patrolRight: 6300 },

    // Section 7 — high frequency
    { type: 'baby', x: 6700, y: 396, patrolLeft: 6540, patrolRight: 6900 },
    { type: 'grizzly', x: 7050, y: 378, patrolLeft: 6900, patrolRight: 7250 },
    { type: 'baby', x: 7400, y: 396, patrolLeft: 7300, patrolRight: 7600 },

    // Executive row
    { type: 'grizzly', x: 8800, y: 378, patrolLeft: 8500, patrolRight: 9050 },
    { type: 'baby', x: 9300, y: 396, patrolLeft: 9150, patrolRight: 9500 },
    { type: 'grizzly', x: 9700, y: 378, patrolLeft: 9500, patrolRight: 9900 },

    // Final run
    { type: 'grizzly', x: 10800, y: 378, patrolLeft: 10500, patrolRight: 11000 },

    // On elevated platforms
    { type: 'baby', x: 1740, y: 244, patrolLeft: 1720, patrolRight: 1840 },
    { type: 'baby', x: 4300, y: 164, patrolLeft: 4280, patrolRight: 4400 },
    { type: 'baby', x: 8920, y: 244, patrolLeft: 8900, patrolRight: 9044 },
  ],

  // 5 short squeeze pads
  shortSqueezePads: [
    { x: 1170, y: 416 },   // Before pit 1
    { x: 3330, y: 416 },   // Before pit 3 (wide)
    { x: 5250, y: 416 },   // Before pit 5 (wide)
    { x: 7650, y: 416 },   // Before pit 7
    { x: 10170, y: 416 },  // Before pit 9 (widest)
  ],

  // 4 red candle zones
  redCandleZones: [
    { x: 2700, width: 400 },   // Terminal banks
    { x: 4000, width: 500 },   // The Pit
    { x: 6700, width: 500 },   // High-frequency zone
    { x: 9500, width: 500 },   // Executive row
  ],

  // 6 dividend coins
  dividendCoins: [
    { x: 820, y: 210 },     // Above column in entrance
    { x: 2000, y: 200 },    // High above section 2
    { x: 4310, y: 160 },    // Very high in The Pit
    { x: 6080, y: 200 },    // Above column in recovery zone
    { x: 7470, y: 210 },    // High-frequency zone reward
    { x: 9980, y: 220 },    // Executive row reward
  ],

  // 90+ bull collectibles
  bulls: [
    // Entrance lobby — welcome line
    { x: 150, y: 400 }, { x: 185, y: 400 }, { x: 220, y: 400 }, { x: 255, y: 400 },

    // On first desk
    { x: 320, y: 308 }, { x: 355, y: 308 }, { x: 390, y: 308 },

    // Arc to terminal
    { x: 460, y: 340 }, { x: 500, y: 310 }, { x: 540, y: 290 }, { x: 580, y: 310 },

    // High column reward
    { x: 810, y: 218 }, { x: 850, y: 218 },

    // Before pit 1
    { x: 1160, y: 360 }, { x: 1200, y: 340 }, { x: 1260, y: 340 }, { x: 1300, y: 360 },

    // Section 2 ground
    { x: 1420, y: 400 }, { x: 1455, y: 400 }, { x: 1490, y: 400 },

    // Section 2 platforms
    { x: 1520, y: 308 }, { x: 1555, y: 308 },
    { x: 1740, y: 248 }, { x: 1780, y: 248 },
    { x: 1970, y: 208 },

    // Before pit 2
    { x: 2240, y: 360 }, { x: 2280, y: 340 }, { x: 2350, y: 340 }, { x: 2390, y: 360 },

    // Section 3
    { x: 2530, y: 400 }, { x: 2565, y: 400 },
    { x: 2620, y: 308 }, { x: 2660, y: 308 },
    { x: 2820, y: 248 }, { x: 2860, y: 248 },
    { x: 3000, y: 198 }, { x: 3040, y: 198 },

    // Before pit 3
    { x: 3320, y: 360 }, { x: 3360, y: 340 }, { x: 3420, y: 320 }, { x: 3520, y: 300 },

    // Section 4 — The Pit
    { x: 3640, y: 400 }, { x: 3675, y: 400 },
    { x: 3720, y: 318 }, { x: 3760, y: 318 },
    { x: 3940, y: 258 }, { x: 3980, y: 258 },
    { x: 4120, y: 208 }, { x: 4160, y: 208 },
    { x: 4300, y: 168 }, { x: 4340, y: 168 },
    { x: 4470, y: 228 }, { x: 4510, y: 228 },

    // Before pit 4
    { x: 4650, y: 360 }, { x: 4700, y: 350 }, { x: 4750, y: 360 },

    // Section 5 island
    { x: 4920, y: 400 }, { x: 4970, y: 308 }, { x: 5010, y: 308 },
    { x: 5120, y: 248 }, { x: 5160, y: 248 },

    // Over pit 5
    { x: 5340, y: 338 }, { x: 5450, y: 298 },

    // Section 6
    { x: 5580, y: 400 }, { x: 5615, y: 400 },
    { x: 5670, y: 318 }, { x: 5710, y: 318 },
    { x: 5900, y: 258 }, { x: 5940, y: 258 },
    { x: 6070, y: 208 }, { x: 6110, y: 208 },

    // Before pit 6
    { x: 6330, y: 360 }, { x: 6370, y: 340 }, { x: 6420, y: 340 },

    // Section 7 — HFT
    { x: 6590, y: 400 }, { x: 6625, y: 400 },
    { x: 6670, y: 308 }, { x: 6710, y: 308 },
    { x: 6850, y: 248 },
    { x: 6990, y: 198 }, { x: 7030, y: 198 },
    { x: 7150, y: 248 },
    { x: 7300, y: 308 }, { x: 7340, y: 308 },
    { x: 7470, y: 218 },
    { x: 7600, y: 278 }, { x: 7640, y: 278 },

    // Over pit 7
    { x: 7750, y: 338 }, { x: 7850, y: 298 },

    // Section 8 island
    { x: 7920, y: 400 }, { x: 7980, y: 258 },

    // Section 9 — Executive row
    { x: 8530, y: 400 }, { x: 8565, y: 400 }, { x: 8600, y: 400 },
    { x: 8620, y: 308 }, { x: 8660, y: 308 }, { x: 8700, y: 308 },
    { x: 8920, y: 248 }, { x: 8960, y: 248 },
    { x: 9170, y: 198 }, { x: 9210, y: 198 },
    { x: 9420, y: 258 }, { x: 9460, y: 258 },
    { x: 9720, y: 308 }, { x: 9760, y: 308 },
    { x: 9970, y: 228 },

    // Over pit 9
    { x: 10270, y: 328 }, { x: 10380, y: 278 },

    // Section 10 — final run
    { x: 10500, y: 400 }, { x: 10535, y: 400 }, { x: 10570, y: 400 },
    { x: 10620, y: 308 }, { x: 10660, y: 308 },
    { x: 10870, y: 268 }, { x: 10910, y: 268 },
    { x: 11120, y: 228 }, { x: 11160, y: 228 },
    { x: 11370, y: 288 }, { x: 11410, y: 288 },
    { x: 11570, y: 248 }, { x: 11610, y: 248 },

    // Final approach
    { x: 11650, y: 360 }, { x: 11680, y: 350 },
  ],

  // 4 moving platforms
  movingPlatforms: [
    { x: 3000, y: 350, w: 96, h: 16, type: 'terminal', speed: 50, waypoints: [{ x: 3000, y: 350 }, { x: 3000, y: 200 }] },
    { x: 5400, y: 350, w: 96, h: 16, type: 'desk', speed: 60, waypoints: [{ x: 5350, y: 350 }, { x: 5480, y: 250 }] },
    { x: 7200, y: 300, w: 96, h: 16, type: 'terminal', speed: 70, waypoints: [{ x: 7100, y: 300 }, { x: 7300, y: 300 }] },
    { x: 10300, y: 380, w: 120, h: 16, type: 'desk', speed: 50, waypoints: [{ x: 10250, y: 380 }, { x: 10250, y: 240 }] },
  ],

  // 2 market crash zones
  marketCrashZones: [
    { x: 4000 },
    { x: 8000 },
  ],
};

const LEVEL_3 = {
  name: "The Crypto Mines",
  theme: 'cryptoMines',
  width: 14400,
  playerStart: { x: 96, y: 370 },
  goalPosition: { x: 14100, y: 380 },

  tickerStocks: [
    { symbol: 'AAPL', price: 232.47, change: 1.2 },
    { symbol: 'MSFT', price: 415.30, change: 0.8 },
    { symbol: 'AMGN', price: 313.55, change: -0.4 },
    { symbol: 'AXP', price: 298.10, change: 1.5 },
    { symbol: 'BA', price: 178.42, change: -1.1 },
    { symbol: 'CAT', price: 362.80, change: 0.6 },
    { symbol: 'CRM', price: 332.15, change: 1.9 },
    { symbol: 'CSCO', price: 58.73, change: 0.3 },
    { symbol: 'CVX', price: 155.60, change: -0.7 },
    { symbol: 'DIS', price: 112.88, change: 2.1 },
    { symbol: 'GS', price: 598.45, change: 0.9 },
    { symbol: 'HD', price: 388.20, change: -0.3 },
    { symbol: 'HON', price: 210.35, change: 0.4 },
    { symbol: 'IBM', price: 228.90, change: 1.1 },
    { symbol: 'JNJ', price: 152.44, change: -0.2 },
    { symbol: 'JPM', price: 252.68, change: 1.3 },
    { symbol: 'KO', price: 61.35, change: 0.5 },
    { symbol: 'MCD', price: 295.80, change: -0.6 },
    { symbol: 'MMM', price: 135.22, change: 2.4 },
    { symbol: 'MRK', price: 99.15, change: -1.8 },
    { symbol: 'NKE', price: 71.50, change: -2.3 },
    { symbol: 'PG', price: 168.92, change: 0.7 },
    { symbol: 'TRV', price: 258.40, change: 1.0 },
    { symbol: 'UNH', price: 528.75, change: -0.5 },
    { symbol: 'V', price: 318.60, change: 1.4 },
    { symbol: 'VZ', price: 40.88, change: 0.2 },
    { symbol: 'WBA', price: 10.25, change: -3.5 },
    { symbol: 'WMT', price: 92.44, change: 0.8 },
    { symbol: 'DOW', price: 42.30, change: -1.2 },
    { symbol: 'INTC', price: 20.15, change: -2.8 },
  ],

  // 12 ground segments with many pits — total covering 14400px
  groundSegments: [
    // Section 1: Mine entrance (0-1080)
    { x: 0, width: 1080 },
    // Pit 1 (width=168)
    // Section 2: First tunnels (1248-2040)
    { x: 1248, width: 792 },
    // Pit 2 (width=216)
    // Section 3: Server farms (2256-3000)
    { x: 2256, width: 744 },
    // Pit 3 (width=240 — wide)
    // Section 4: Crystal cavern (3240-4200)
    { x: 3240, width: 960 },
    // Pit 4 (width=192)
    // Section 5: Narrow bridge (4392-4680)
    { x: 4392, width: 288 },
    // Pit 5 (width=264 — very wide)
    // Section 6: Hash mines (4944-5760)
    { x: 4944, width: 816 },
    // Pit 6 (width=216)
    // Section 7: Neon corridor (5976-6960)
    { x: 5976, width: 984 },
    // Pit 7 (width=240)
    // Section 8: Short ledge (7200-7500)
    { x: 7200, width: 300 },
    // Pit 8 (width=264 — very wide)
    // Section 9: Blockchain bridge (7764-8760)
    { x: 7764, width: 996 },
    // Pit 9 (width=192)
    // Section 10: Deep mines (8952-10800)
    { x: 8952, width: 1848 },
    // Pit 10 (width=240)
    // Section 11: Pre-boss gauntlet (11040-12600)
    { x: 11040, width: 1560 },
    // Pit 11 (width=200)
    // Section 12: Boss arena + goal (12800-14400)
    { x: 12800, width: 1600 },
  ],

  // ~60 platforms using ledge, server, crystal types
  platforms: [
    // == MINE ENTRANCE (0-1080) ==
    { x: 280, y: 340, w: 120, h: 16, type: 'server' },
    { x: 480, y: 290, w: 96, h: 16, type: 'crystal' },
    { x: 700, y: 250, w: 72, h: 16, type: 'ledge' },
    { x: 900, y: 320, w: 120, h: 16, type: 'server' },

    // == OVER PIT 1 ==
    { x: 1110, y: 380, w: 96, h: 16, type: 'crystal' },

    // == SECTION 2: TUNNELS (1248-2040) ==
    { x: 1380, y: 340, w: 120, h: 16, type: 'server' },
    { x: 1560, y: 280, w: 96, h: 16, type: 'crystal' },
    { x: 1720, y: 230, w: 72, h: 16, type: 'ledge' },
    { x: 1900, y: 300, w: 120, h: 16, type: 'server' },

    // == OVER PIT 2 ==
    { x: 2090, y: 370, w: 72, h: 16, type: 'crystal' },
    { x: 2180, y: 320, w: 72, h: 16, type: 'ledge' },

    // == SECTION 3: SERVER FARMS (2256-3000) ==
    { x: 2380, y: 340, w: 96, h: 16, type: 'server' },
    { x: 2540, y: 270, w: 72, h: 16, type: 'crystal' },
    { x: 2680, y: 220, w: 96, h: 16, type: 'ledge' },
    { x: 2850, y: 300, w: 120, h: 16, type: 'server' },

    // == OVER PIT 3 (wide) ==
    { x: 3040, y: 370, w: 72, h: 16, type: 'crystal' },
    { x: 3130, y: 320, w: 72, h: 16, type: 'ledge' },

    // == SECTION 4: CRYSTAL CAVERN (3240-4200) ==
    { x: 3380, y: 340, w: 120, h: 16, type: 'crystal' },
    { x: 3560, y: 280, w: 96, h: 16, type: 'server' },
    { x: 3800, y: 230, w: 72, h: 16, type: 'crystal' },
    { x: 3880, y: 200, w: 96, h: 16, type: 'ledge' },
    { x: 4050, y: 260, w: 120, h: 16, type: 'crystal' },

    // == OVER PIT 4 ==
    { x: 4250, y: 380, w: 96, h: 16, type: 'server' },

    // == SECTION 5: NARROW BRIDGE (4392-4680) ==
    { x: 4450, y: 330, w: 72, h: 16, type: 'crystal' },
    { x: 4580, y: 280, w: 72, h: 16, type: 'ledge' },

    // == OVER PIT 5 (very wide) ==
    { x: 4720, y: 370, w: 72, h: 16, type: 'crystal' },
    { x: 4820, y: 320, w: 72, h: 16, type: 'ledge' },
    { x: 4900, y: 380, w: 72, h: 16, type: 'crystal' },

    // == SECTION 6: HASH MINES (4944-5760) ==
    { x: 5080, y: 340, w: 96, h: 16, type: 'server' },
    { x: 5250, y: 280, w: 72, h: 16, type: 'crystal' },
    { x: 5400, y: 230, w: 96, h: 16, type: 'ledge' },
    { x: 5570, y: 300, w: 120, h: 16, type: 'server' },

    // == OVER PIT 6 ==
    { x: 5810, y: 370, w: 72, h: 16, type: 'crystal' },
    { x: 5910, y: 320, w: 72, h: 16, type: 'ledge' },

    // == SECTION 7: NEON CORRIDOR (5976-6960) ==
    { x: 6100, y: 340, w: 96, h: 16, type: 'server' },
    { x: 6260, y: 280, w: 72, h: 16, type: 'crystal' },
    { x: 6480, y: 230, w: 72, h: 16, type: 'ledge' },
    { x: 6540, y: 280, w: 96, h: 16, type: 'crystal' },
    { x: 6700, y: 340, w: 72, h: 16, type: 'server' },
    { x: 6850, y: 260, w: 96, h: 16, type: 'crystal' },

    // == OVER PIT 7 (wide) ==
    { x: 7010, y: 370, w: 72, h: 16, type: 'crystal' },
    { x: 7100, y: 320, w: 72, h: 16, type: 'ledge' },

    // == SECTION 8: SHORT LEDGE (7200-7500) ==
    { x: 7280, y: 300, w: 96, h: 16, type: 'server' },
    { x: 7420, y: 340, w: 72, h: 16, type: 'crystal' },

    // == OVER PIT 8 (very wide) ==
    { x: 7550, y: 370, w: 72, h: 16, type: 'crystal' },
    { x: 7640, y: 310, w: 72, h: 16, type: 'ledge' },
    { x: 7720, y: 360, w: 72, h: 16, type: 'crystal' },

    // == SECTION 9: BLOCKCHAIN BRIDGE (7764-8760) ==
    { x: 7900, y: 340, w: 120, h: 16, type: 'server' },
    { x: 8100, y: 280, w: 96, h: 16, type: 'crystal' },
    { x: 8380, y: 230, w: 72, h: 16, type: 'ledge' },
    { x: 8500, y: 290, w: 120, h: 16, type: 'server' },
    { x: 8680, y: 340, w: 96, h: 16, type: 'crystal' },

    // == OVER PIT 9 ==
    { x: 8810, y: 380, w: 96, h: 16, type: 'server' },

    // == SECTION 10: DEEP MINES (8952-10800) ==
    { x: 9100, y: 340, w: 120, h: 16, type: 'server' },
    { x: 9350, y: 280, w: 96, h: 16, type: 'crystal' },
    { x: 9550, y: 230, w: 72, h: 16, type: 'ledge' },
    { x: 9750, y: 280, w: 96, h: 16, type: 'crystal' },
    { x: 9950, y: 340, w: 120, h: 16, type: 'server' },
    { x: 10200, y: 260, w: 72, h: 16, type: 'crystal' },
    { x: 10400, y: 300, w: 96, h: 16, type: 'server' },
    { x: 10600, y: 250, w: 72, h: 16, type: 'ledge' },

    // == OVER PIT 10 ==
    { x: 10850, y: 370, w: 72, h: 16, type: 'crystal' },
    { x: 10950, y: 320, w: 72, h: 16, type: 'ledge' },

    // == SECTION 11: PRE-BOSS GAUNTLET (11040-12600) ==
    { x: 11180, y: 340, w: 96, h: 16, type: 'server' },
    { x: 11350, y: 280, w: 72, h: 16, type: 'crystal' },
    { x: 11500, y: 230, w: 72, h: 16, type: 'ledge' },
    { x: 11650, y: 280, w: 96, h: 16, type: 'crystal' },
    { x: 11800, y: 340, w: 120, h: 16, type: 'server' },
    { x: 12000, y: 260, w: 72, h: 16, type: 'crystal' },
    { x: 12200, y: 300, w: 96, h: 16, type: 'server' },
    { x: 12400, y: 340, w: 120, h: 16, type: 'crystal' },
  ],

  // 18 question blocks
  questionBlocks: [
    // Mine entrance
    { x: 300, y: 240, contents: 'bull' },
    { x: 356, y: 240, contents: 'hodlItem' },

    // Tunnels
    { x: 1400, y: 240, contents: 'bull' },
    { x: 1580, y: 220, contents: 'bull' },

    // Server farms
    { x: 2560, y: 220, contents: 'hodlItem' },
    { x: 2700, y: 170, contents: 'bull' },

    // Crystal cavern
    { x: 3580, y: 220, contents: 'bull' },
    { x: 3740, y: 180, contents: 'hodlItem' },
    { x: 3900, y: 150, contents: 'bull' },

    // Hash mines
    { x: 5270, y: 220, contents: 'bull' },
    { x: 5420, y: 180, contents: 'hodlItem' },

    // Neon corridor
    { x: 6280, y: 220, contents: 'bull' },
    { x: 6420, y: 180, contents: 'bull' },

    // Blockchain bridge
    { x: 8120, y: 220, contents: 'hodlItem' },
    { x: 8320, y: 180, contents: 'bull' },

    // Deep mines
    { x: 9370, y: 220, contents: 'bull' },
    { x: 9570, y: 180, contents: 'hodlItem' },

    // Pre-boss gauntlet
    { x: 11520, y: 180, contents: 'hodlItem' },
  ],

  // ~25 enemies — lots of grizzlies
  enemies: [
    // Mine entrance
    { type: 'baby', x: 350, y: 396, patrolLeft: 250, patrolRight: 550 },
    { type: 'grizzly', x: 750, y: 378, patrolLeft: 600, patrolRight: 950 },

    // Tunnels
    { type: 'grizzly', x: 1400, y: 378, patrolLeft: 1260, patrolRight: 1600 },
    { type: 'baby', x: 1750, y: 396, patrolLeft: 1650, patrolRight: 1900 },
    { type: 'grizzly', x: 1950, y: 378, patrolLeft: 1850, patrolRight: 2030 },

    // Server farms
    { type: 'grizzly', x: 2500, y: 378, patrolLeft: 2270, patrolRight: 2700 },
    { type: 'baby', x: 2850, y: 396, patrolLeft: 2750, patrolRight: 2990 },

    // Crystal cavern
    { type: 'grizzly', x: 3450, y: 378, patrolLeft: 3250, patrolRight: 3650 },
    { type: 'baby', x: 3800, y: 396, patrolLeft: 3700, patrolRight: 3950 },
    { type: 'grizzly', x: 4100, y: 378, patrolLeft: 3950, patrolRight: 4190 },

    // Hash mines
    { type: 'grizzly', x: 5150, y: 378, patrolLeft: 4950, patrolRight: 5350 },
    { type: 'baby', x: 5500, y: 396, patrolLeft: 5400, patrolRight: 5700 },
    { type: 'grizzly', x: 5700, y: 378, patrolLeft: 5550, patrolRight: 5750 },

    // Neon corridor
    { type: 'grizzly', x: 6200, y: 378, patrolLeft: 5990, patrolRight: 6400 },
    { type: 'baby', x: 6550, y: 396, patrolLeft: 6450, patrolRight: 6700 },
    { type: 'grizzly', x: 6850, y: 378, patrolLeft: 6700, patrolRight: 6950 },

    // Blockchain bridge
    { type: 'grizzly', x: 8000, y: 378, patrolLeft: 7780, patrolRight: 8200 },
    { type: 'baby', x: 8400, y: 396, patrolLeft: 8300, patrolRight: 8550 },
    { type: 'grizzly', x: 8700, y: 378, patrolLeft: 8550, patrolRight: 8750 },

    // Deep mines
    { type: 'grizzly', x: 9300, y: 378, patrolLeft: 8960, patrolRight: 9500 },
    { type: 'baby', x: 9800, y: 396, patrolLeft: 9700, patrolRight: 10000 },
    { type: 'grizzly', x: 10300, y: 378, patrolLeft: 10100, patrolRight: 10500 },
    { type: 'grizzly', x: 10700, y: 378, patrolLeft: 10500, patrolRight: 10790 },

    // Pre-boss gauntlet
    { type: 'grizzly', x: 11300, y: 378, patrolLeft: 11050, patrolRight: 11500 },
    { type: 'grizzly', x: 11700, y: 378, patrolLeft: 11550, patrolRight: 11900 },
    { type: 'baby', x: 12100, y: 396, patrolLeft: 12000, patrolRight: 12300 },
    { type: 'grizzly', x: 12450, y: 378, patrolLeft: 12300, patrolRight: 12590 },

    // On elevated platforms
    { type: 'baby', x: 1580, y: 244, patrolLeft: 1560, patrolRight: 1656 },
    { type: 'baby', x: 3740, y: 194, patrolLeft: 3720, patrolRight: 3792 },
    { type: 'baby', x: 6280, y: 244, patrolLeft: 6260, patrolRight: 6332 },
  ],

  // 6 short squeeze pads
  shortSqueezePads: [
    { x: 1050, y: 416 },    // Before pit 1
    { x: 2970, y: 416 },    // Before pit 3 (wide)
    { x: 4650, y: 416 },    // Before pit 5 (very wide)
    { x: 6930, y: 416 },    // Before pit 7 (wide)
    { x: 10770, y: 416 },   // Before pit 10
    { x: 12570, y: 416 },   // Before pit 11
  ],

  // 5 red candle zones
  redCandleZones: [
    { x: 2400, width: 400 },   // Server farms
    { x: 3600, width: 500 },   // Crystal cavern
    { x: 5200, width: 500 },   // Hash mines
    { x: 6300, width: 500 },   // Neon corridor
    { x: 9400, width: 600 },   // Deep mines
  ],

  // 8 dividend coins
  dividendCoins: [
    { x: 720, y: 210 },     // Mine entrance high area
    { x: 1740, y: 190 },    // Above ledge in tunnels
    { x: 2700, y: 180 },    // Above ledge in server farms
    { x: 3900, y: 160 },    // Above high ledge in crystal cavern
    { x: 5420, y: 190 },    // Hash mines high
    { x: 6420, y: 190 },    // Neon corridor high
    { x: 8320, y: 190 },    // Blockchain bridge high
    { x: 10220, y: 220 },   // Deep mines
  ],

  // 100+ bulls
  bulls: [
    // Mine entrance — opening line
    { x: 150, y: 400 }, { x: 185, y: 400 }, { x: 220, y: 400 },

    // On server platform
    { x: 300, y: 308 }, { x: 340, y: 308 },

    // Crystal arc
    { x: 420, y: 330 }, { x: 460, y: 300 }, { x: 500, y: 280 }, { x: 540, y: 300 },

    // High ledge
    { x: 710, y: 218 }, { x: 750, y: 218 },

    // Ground near pit 1
    { x: 960, y: 400 }, { x: 1000, y: 400 },
    { x: 1050, y: 360 }, { x: 1090, y: 340 }, { x: 1130, y: 340 },

    // Section 2 ground
    { x: 1300, y: 400 }, { x: 1335, y: 400 },
    { x: 1400, y: 308 }, { x: 1440, y: 308 },
    { x: 1580, y: 248 }, { x: 1620, y: 248 },
    { x: 1740, y: 198 },

    // Over pit 2
    { x: 2110, y: 338 }, { x: 2200, y: 288 },

    // Section 3
    { x: 2310, y: 400 }, { x: 2345, y: 400 },
    { x: 2400, y: 308 }, { x: 2440, y: 308 },
    { x: 2560, y: 238 }, { x: 2600, y: 238 },
    { x: 2700, y: 188 }, { x: 2740, y: 188 },

    // Over pit 3
    { x: 3060, y: 338 }, { x: 3150, y: 288 },

    // Section 4 — Crystal cavern
    { x: 3300, y: 400 }, { x: 3335, y: 400 },
    { x: 3400, y: 308 }, { x: 3440, y: 308 },
    { x: 3580, y: 248 }, { x: 3620, y: 248 },
    { x: 3740, y: 198 }, { x: 3780, y: 198 },
    { x: 3900, y: 168 }, { x: 3940, y: 168 },
    { x: 4070, y: 228 }, { x: 4110, y: 228 },

    // Over pit 4
    { x: 4270, y: 348 },

    // Section 5 narrow
    { x: 4430, y: 400 },
    { x: 4470, y: 298 }, { x: 4600, y: 248 },

    // Over pit 5
    { x: 4740, y: 338 }, { x: 4840, y: 288 }, { x: 4920, y: 348 },

    // Section 6 — Hash mines
    { x: 5000, y: 400 }, { x: 5035, y: 400 },
    { x: 5100, y: 308 }, { x: 5140, y: 308 },
    { x: 5270, y: 248 }, { x: 5310, y: 248 },
    { x: 5420, y: 198 }, { x: 5460, y: 198 },
    { x: 5590, y: 268 }, { x: 5630, y: 268 },

    // Over pit 6
    { x: 5830, y: 338 }, { x: 5930, y: 288 },

    // Section 7 — Neon corridor
    { x: 6030, y: 400 }, { x: 6065, y: 400 },
    { x: 6120, y: 308 }, { x: 6160, y: 308 },
    { x: 6280, y: 248 }, { x: 6320, y: 248 },
    { x: 6420, y: 198 }, { x: 6460, y: 198 },
    { x: 6560, y: 248 },
    { x: 6720, y: 308 },
    { x: 6870, y: 228 }, { x: 6910, y: 228 },

    // Over pit 7
    { x: 7030, y: 338 }, { x: 7120, y: 288 },

    // Section 8 short
    { x: 7250, y: 400 },
    { x: 7300, y: 268 }, { x: 7440, y: 308 },

    // Over pit 8
    { x: 7570, y: 338 }, { x: 7660, y: 278 }, { x: 7740, y: 328 },

    // Section 9 — Blockchain
    { x: 7820, y: 400 }, { x: 7855, y: 400 },
    { x: 7920, y: 308 }, { x: 7960, y: 308 },
    { x: 8120, y: 248 }, { x: 8160, y: 248 },
    { x: 8320, y: 198 }, { x: 8360, y: 198 },
    { x: 8520, y: 258 }, { x: 8560, y: 258 },
    { x: 8700, y: 308 },

    // Over pit 9
    { x: 8830, y: 348 },

    // Section 10 — Deep mines
    { x: 9010, y: 400 }, { x: 9045, y: 400 }, { x: 9080, y: 400 },
    { x: 9120, y: 308 }, { x: 9160, y: 308 },
    { x: 9370, y: 248 }, { x: 9410, y: 248 },
    { x: 9570, y: 198 }, { x: 9610, y: 198 },
    { x: 9770, y: 248 }, { x: 9810, y: 248 },
    { x: 9970, y: 308 }, { x: 10010, y: 308 },
    { x: 10220, y: 228 }, { x: 10260, y: 228 },
    { x: 10420, y: 268 }, { x: 10460, y: 268 },
    { x: 10620, y: 218 }, { x: 10660, y: 218 },

    // Over pit 10
    { x: 10870, y: 338 }, { x: 10970, y: 288 },

    // Section 11 — Pre-boss gauntlet
    { x: 11100, y: 400 }, { x: 11135, y: 400 },
    { x: 11200, y: 308 }, { x: 11240, y: 308 },
    { x: 11370, y: 248 }, { x: 11410, y: 248 },
    { x: 11520, y: 198 }, { x: 11560, y: 198 },
    { x: 11670, y: 248 },
    { x: 11820, y: 308 }, { x: 11860, y: 308 },
    { x: 12020, y: 228 }, { x: 12060, y: 228 },
    { x: 12220, y: 268 },
    { x: 12420, y: 308 },

    // Section 12 — Boss arena approach
    { x: 12850, y: 400 }, { x: 12885, y: 400 }, { x: 12920, y: 400 },
    { x: 12955, y: 400 }, { x: 12990, y: 400 },
  ],

  // 6 moving platforms
  movingPlatforms: [
    { x: 2700, y: 350, w: 96, h: 16, type: 'crystal', speed: 50, waypoints: [{ x: 2700, y: 350 }, { x: 2700, y: 200 }] },
    { x: 4800, y: 360, w: 96, h: 16, type: 'server', speed: 60, waypoints: [{ x: 4720, y: 360 }, { x: 4900, y: 260 }] },
    { x: 6600, y: 300, w: 96, h: 16, type: 'crystal', speed: 70, waypoints: [{ x: 6500, y: 300 }, { x: 6700, y: 300 }] },
    { x: 7650, y: 370, w: 96, h: 16, type: 'server', speed: 55, waypoints: [{ x: 7560, y: 370 }, { x: 7710, y: 250 }] },
    { x: 10100, y: 300, w: 96, h: 16, type: 'crystal', speed: 65, waypoints: [{ x: 10000, y: 300 }, { x: 10200, y: 300 }] },
    { x: 10900, y: 380, w: 120, h: 16, type: 'server', speed: 50, waypoints: [{ x: 10850, y: 380 }, { x: 10850, y: 240 }] },
  ],

  // 3 market crash zones
  marketCrashZones: [
    { x: 3600 },
    { x: 6500 },
    { x: 10500 },
  ],

  // Boss arena at end of level
  bossArena: { x: 13600, wallLeft: 13600, wallRight: 14200, y: 432 },
};

function loadLevel(levelData) {
  const groundY = 432;
  const groundH = CONFIG.VIRTUAL_HEIGHT - groundY + 200;

  const level = {
    width: levelData.width || 9600,
    height: CONFIG.VIRTUAL_HEIGHT + 200,
    solids: [],
    platforms: [],
    questionBlocks: [],
    enemies: [],
    collectibles: [],
    shortSqueezePads: [],
    movingPlatforms: [],
    marketCrashZones: levelData.marketCrashZones ? levelData.marketCrashZones.map(z => ({ ...z, triggered: false })) : [],
    redCandleZones: levelData.redCandleZones || [],
    redCandleTimer: 0,
    goalPosition: { ...levelData.goalPosition },
    tickerStocks: levelData.tickerStocks,
    name: levelData.name,
    bossArena: levelData.bossArena || null,
    boss: null,
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

  // Add dividend coins
  if (levelData.dividendCoins) {
    for (const d of levelData.dividendCoins) {
      level.collectibles.push(new DividendCoin(d.x, d.y));
    }
  }

  // Add short squeeze pads
  if (levelData.shortSqueezePads) {
    for (const pad of levelData.shortSqueezePads) {
      level.shortSqueezePads.push(new ShortSqueezePad(pad.x, pad.y));
    }
  }

  // Add moving platforms
  if (levelData.movingPlatforms) {
    for (const mp of levelData.movingPlatforms) {
      const platform = new MovingPlatform(mp.x, mp.y, mp.w, mp.h, mp.type, mp.waypoints, mp.speed);
      level.movingPlatforms.push(platform);
      level.solids.push(platform); // Also add to solids for collision
    }
  }

  // Spawn boss if bossArena is defined
  if (levelData.bossArena) {
    const arena = levelData.bossArena;
    const bossX = (arena.wallLeft + arena.wallRight) / 2 - 60; // center boss
    const bossY = arena.y - 90; // boss height is 90
    level.boss = new WhaleBoss(bossX, bossY, arena.wallLeft, arena.wallRight);
  }

  return level;
}
