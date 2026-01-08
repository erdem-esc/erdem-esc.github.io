# Playable Ad

A standalone HTML5 playable ad for AppLovin and Unity Ads.

## Quick Start

1. Open `index.html` in a browser to test locally
2. Replace store URLs in CONFIG section
3. Export sprites from Unity and integrate (optional)
4. Upload to ad network

## Testing Locally

```bash
# Simple HTTP server (Python 3)
cd playable-ad
python3 -m http.server 8080
# Open http://localhost:8080
```

Or just drag `index.html` into your browser.

## Configuration

Edit the `CONFIG` object in `index.html`:

```javascript
const CONFIG = {
    // IMPORTANT: Replace with your actual store URLs
    STORE_URL_IOS: 'https://apps.apple.com/app/your-game-id',
    STORE_URL_ANDROID: 'https://play.google.com/store/apps/details?id=your.game.id',

    // Gameplay tuning
    PLAYER_SPEED: 5,
    BULLET_SPEED: 12,
    BULLET_FIRE_RATE: 0.25,      // seconds between shots
    ENEMY_SPEED: 1.5,
    ENEMY_SPAWN_RATE: 1.5,       // seconds between spawns
    XP_TO_LEVEL: 5,              // XP needed to trigger upgrade

    // Orbital settings
    ORBITAL_COUNT: 3,
    ORBITAL_RADIUS: 60,
    ORBITAL_SPEED: 3,

    // Game flow
    CTA_TRIGGER_KILLS: 15,       // Show CTA after this many kills
};
```

## Game Flow

```
1. Player spawns center screen
2. "Drag to move" hint shown
3. Enemies spawn from edges, approach player
4. Auto-fire kills enemies
5. XP orbs drop, attracted to player
6. After 5 XP: Level up, pick "Orbitals"
7. Orbitals circle player, destroying enemies
8. After 15 kills: CTA screen appears
9. "PLAY NOW" button → App Store
```

## Adding Sprites

To replace colored circles with actual game sprites:

### 1. Export from Unity

Export these as PNG with transparency:
- `player.png` (~40x40px)
- `enemy.png` (~36x36px)
- `bullet.png` (~12x12px)
- `xp_orb.png` (~16x16px)
- `orbital.png` (~24x24px)
- `background.png` (optional, tileable)

### 2. Add Sprite Loading

Add to the `<script>` section before `init()`:

```javascript
const sprites = {};
const spriteUrls = {
    player: 'assets/player.png',
    enemy: 'assets/enemy.png',
    bullet: 'assets/bullet.png',
    xp: 'assets/xp_orb.png',
    orbital: 'assets/orbital.png'
};

function loadSprites(callback) {
    let loaded = 0;
    const total = Object.keys(spriteUrls).length;

    for (const [key, url] of Object.entries(spriteUrls)) {
        const img = new Image();
        img.onload = () => {
            sprites[key] = img;
            loaded++;
            if (loaded === total) callback();
        };
        img.src = url;
    }
}
```

### 3. Update Rendering

Replace circle drawing with:

```javascript
// Instead of ctx.arc for player:
ctx.drawImage(sprites.player,
    game.player.x - 20,
    game.player.y - 20,
    40, 40);
```

## Ad Network Submission

### AppLovin

1. Ensure single HTML file (already done)
2. Max size: 5MB
3. Test with AppLovin Playable Preview tool
4. Upload via AppLovin dashboard

### Unity Ads

1. Single HTML file format
2. Max size: 5MB
3. Test with Unity Ads preview
4. MRAID integration included

### File Size Optimization

Current: ~12KB (no sprites)

If over 5MB with sprites:
- Compress PNGs with TinyPNG
- Use sprite sheets
- Reduce sprite dimensions
- Convert to base64 inline (eliminates separate files)

## Base64 Sprite Embedding

For single-file submission without external assets:

```javascript
const sprites = {
    player: 'data:image/png;base64,iVBORw0KGgo...',
    enemy: 'data:image/png;base64,iVBORw0KGgo...'
};

// Load inline
const img = new Image();
img.src = sprites.player;
```

## MRAID Reference

The playable includes MRAID integration for ad networks:

```javascript
// Opens store (handled automatically)
mraid.open(storeUrl);

// Check if ready
mraid.isReady();

// Listen for ready event
mraid.addEventListener('ready', callback);
```

## Customization Ideas

- Add particle effects on enemy death
- Screen shake on hit
- Sound effects (increases file size)
- Multiple upgrade choices
- Boss enemy before CTA
- Progress indicator ("Kill 5 more!")
