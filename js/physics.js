function aabbOverlap(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function getOverlap(a, b) {
  const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  if (overlapX <= 0 || overlapY <= 0) return null;
  return { x: overlapX, y: overlapY };
}

function applyGravity(entity, dt) {
  entity.vy += CONFIG.GRAVITY * dt;
  if (entity.vy > CONFIG.MAX_FALL_SPEED) {
    entity.vy = CONFIG.MAX_FALL_SPEED;
  }
}

// Proper two-pass collision for the player:
// Move on X axis, resolve X collisions, then move on Y axis, resolve Y collisions.
// This prevents the ambiguity that causes "sticking" to walls.
function moveAndCollide(entity, solids, dt) {
  // 1. Move horizontally only
  entity.x += entity.vx * dt;

  // 2. Resolve horizontal collisions
  for (const solid of solids) {
    if (!aabbOverlap(entity, solid)) continue;
    if (entity.vx > 0) {
      entity.x = solid.x - entity.width;
    } else if (entity.vx < 0) {
      entity.x = solid.x + solid.width;
    } else {
      // Zero velocity overlap — push out by nearest side
      const moverCenter = entity.x + entity.width / 2;
      const solidCenter = solid.x + solid.width / 2;
      if (moverCenter < solidCenter) {
        entity.x = solid.x - entity.width;
      } else {
        entity.x = solid.x + solid.width;
      }
    }
    entity.vx = 0;
  }

  // 3. Move vertically only
  entity.y += entity.vy * dt;

  // 4. Resolve vertical collisions
  entity.onGround = false;
  for (const solid of solids) {
    if (!aabbOverlap(entity, solid)) continue;
    if (entity.vy >= 0) {
      // Falling or stationary — land on top
      entity.y = solid.y - entity.height;
      entity.vy = 0;
      entity.onGround = true;
    } else {
      // Moving up — hit bottom of block
      entity.y = solid.y + solid.height;
      entity.vy = 0;
      if (solid.onHitFromBelow) {
        solid.onHitFromBelow();
      }
    }
  }
}

// For enemies: they move themselves, then we resolve overlaps
function resolveEntityCollisions(entity, solids) {
  // Horizontal resolution
  for (const solid of solids) {
    if (!aabbOverlap(entity, solid)) continue;
    const overlap = getOverlap(entity, solid);
    if (!overlap) continue;
    if (overlap.x < overlap.y) {
      // Horizontal collision is smaller — resolve horizontally
      const moverCenter = entity.x + entity.width / 2;
      const solidCenter = solid.x + solid.width / 2;
      if (moverCenter < solidCenter) {
        entity.x = solid.x - entity.width;
      } else {
        entity.x = solid.x + solid.width;
      }
      entity.vx = -entity.vx; // Enemies reverse direction on wall
    }
  }

  // Vertical resolution
  entity.onGround = false;
  for (const solid of solids) {
    if (!aabbOverlap(entity, solid)) continue;
    const overlap = getOverlap(entity, solid);
    if (!overlap) continue;
    if (overlap.y <= overlap.x) {
      const moverCenter = entity.y + entity.height / 2;
      const solidCenter = solid.y + solid.height / 2;
      if (moverCenter < solidCenter) {
        entity.y = solid.y - entity.height;
        if (entity.vy > 0) entity.vy = 0;
        entity.onGround = true;
      } else {
        entity.y = solid.y + solid.height;
        if (entity.vy < 0) entity.vy = 0;
      }
    }
  }
}
