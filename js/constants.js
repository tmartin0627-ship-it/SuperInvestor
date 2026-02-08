// Math.clamp polyfill
Math.clamp = Math.clamp || function(val, min, max) {
  return Math.max(min, Math.min(max, val));
};

const GameState = {
  TITLE: 'title',
  CHARACTER_SELECT: 'characterSelect',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
  LEVEL_COMPLETE: 'levelComplete'
};

// Supabase config — fill in with your project credentials
const SUPABASE_URL = 'https://ldvqqitugklrutkooofg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0ELBZFneSvZPgjy314KWVQ_XbgU4x-A';

const CONFIG = {
  // Display
  VIRTUAL_WIDTH: 960,
  VIRTUAL_HEIGHT: 540,
  TILE_SIZE: 48,

  // Physics
  GRAVITY: 1800,
  MAX_FALL_SPEED: 900,
  GROUND_FRICTION: 0.85,

  // Player
  PLAYER_WIDTH: 36,
  PLAYER_HEIGHT: 54,
  PLAYER_RUN_SPEED: 280,
  PLAYER_ACCELERATION: 1400,
  PLAYER_JUMP_VELOCITY: -580,
  PLAYER_SUPER_JUMP_VELOCITY: -750,  // Crouch-jump: ~170px height vs ~93px normal
  PLAYER_CROUCH_TIME: 0.25,          // Seconds to hold crouch before super jump is ready
  PLAYER_CROUCH_HEIGHT: 34,          // Crouched height (shorter)
  PLAYER_STOMP_BOUNCE: -350,
  PLAYER_MAX_LIVES: 3,
  PLAYER_INVINCIBILITY_TIME: 2.0,
  PLAYER_POWERED_WIDTH: 42,
  PLAYER_POWERED_HEIGHT: 66,
  PLAYER_POWERED_CROUCH_HEIGHT: 42,  // Crouched height when powered

  // Enemies
  BABY_BEAR_SPEED: 80,
  BABY_BEAR_WIDTH: 36,
  BABY_BEAR_HEIGHT: 36,
  GRIZZLY_SPEED: 120,
  GRIZZLY_CHARGE_SPEED: 250,
  GRIZZLY_WIDTH: 54,
  GRIZZLY_HEIGHT: 54,
  GRIZZLY_DETECT_RANGE: 250,
  GRIZZLY_HP: 2,

  // Collectibles
  BULL_WIDTH: 30,
  BULL_HEIGHT: 26,
  BULL_BOB_SPEED: 3,
  BULL_BOB_AMPLITUDE: 6,
  BULL_SCORE: 100,
  BULLS_FOR_DIAMOND_HANDS: 20,
  DIAMOND_HANDS_DURATION: 10.0,
  DIVIDEND_SCORE: 500,

  // Question Block
  BLOCK_SIZE: 48,
  BLOCK_BUMP_HEIGHT: 12,
  BLOCK_BUMP_DURATION: 0.2,

  // Camera
  CAMERA_LOOKAHEAD: 100,
  CAMERA_SMOOTHING: 0.08,
  CAMERA_DEAD_ZONE_X: 50,

  // Parallax
  BG_LAYER_SPEEDS: [0.1, 0.3, 0.6],

  // Colors
  COLORS: {
    SKY_TOP: '#0a0a2e',
    SKY_MID: '#1a1a3e',
    SKY_BOTTOM: '#2a2a4e',
    GROUND: '#2d2d4e',
    GROUND_TOP: '#3d3d5e',
    PLATFORM_DESK: '#8B6914',
    PLATFORM_DESK_TOP: '#A07818',
    PLATFORM_LEDGE: '#5a5a7a',
    PLATFORM_TAXI: '#f0c040',
    PLATFORM_TAXI_DARK: '#c09a30',
    QUESTION_BLOCK: '#FFD700',
    QUESTION_BLOCK_BORDER: '#B8860B',
    QUESTION_BLOCK_USED: '#8B7355',
    PLAYER_SUIT: '#1a1a40',
    PLAYER_SHIRT: '#FFFFFF',
    PLAYER_TIE: '#cc0000',
    PLAYER_SKIN: '#f5d0a0',
    PLAYER_HAIR_MALE: '#2a2a2a',
    PLAYER_HAIR_FEMALE: '#8B4513',
    PLAYER_BLAZER: '#2a2a5a',
    PLAYER_BLAZER_LIGHT: '#3a3a6a',
    BEAR_BROWN: '#8B4513',
    BEAR_DARK: '#5C3317',
    BEAR_BELLY: '#D2B48C',
    BULL_GOLD: '#FFD700',
    BULL_BODY: '#DAA520',
    BULL_DARK: '#B8860B',
    GREEN_CANDLE: '#00CC66',
    GREEN_CANDLE_DARK: '#009944',
    CHARGING_BULL: '#FFD700',
    BUILDING_1: '#1a1a3a',
    BUILDING_2: '#252545',
    BUILDING_3: '#2a2a4a',
    BUILDING_4: '#1f1f3f',
    WINDOW_LIT: '#FFE4B5',
    WINDOW_LIT_2: '#87CEEB',
    WINDOW_DARK: '#0e0e1e',
    HUD_BG: 'rgba(0,0,0,0.7)',
    TICKER_BG: 'rgba(0,0,0,0.85)',
    TICKER_GREEN: '#00FF88',
    TICKER_RED: '#FF4444',
    PIT_VOID: '#0a0a1a',
    PARTICLE_RED: '#FF3333',
    PARTICLE_BEAR: '#8B4513',
    GOLDEN: '#FFD700',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
  }
};
