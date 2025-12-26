# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MQ PWA (Menschenquartett) is a Progressive Web App for organizing the "Menschenquartett" game - a memory-based social game where players enter secret aliases on a shared smartphone, then try to remember and match them.

**Live URL**: https://mq.juandid.com
**Game description**: https://juandid.com/posts/mq-game/

## Technology Stack

- **Frontend**: Vanilla JavaScript with jQuery 3.5.1
- **UI Framework**: Bootstrap 5 (with Bootstrap Icons)
- **Data Storage**: IndexedDB (browser-based)
- **PWA**: Service Worker for offline capability
- **Language**: German (UI text and comments)

## Architecture

### Core Files

- `index.html` - Single-page application entry point
- `mq.js` - Main application logic and IndexedDB operations
- `sw.js` - Service worker for PWA offline caching
- `manifest.json` - PWA configuration

### Application Flow

1. **Input Phase**: Players enter aliases via form (`#aliasForm`)
   - Validation: minimum 2 letters required (regex: `.*[A-Za-z]{2}.*`)
   - Each alias is stored in IndexedDB and displayed as masked (asterisks)
   - Aliases stored in `aliases` object store with auto-incrementing `id` field

2. **Complete Phase**: User clicks complete icon (`#completeLink`)
   - Triggers `shuffleAliasList()` which randomizes alias display order
   - Stores randomized indices in `indArr` array
   - Hides input form, shows "show" icon

3. **Reveal Phase**: User toggles visibility
   - Show (`#showLink`): Displays aliases in shuffled order
   - Hide (`#hideLink`): Masks aliases again with asterisks

4. **Reset**: Clear icon (`#clearLink`) with confirmation modal
   - Clears IndexedDB store
   - Resets UI to input phase

### IndexedDB Structure

- **Database**: `MQ_DB` (version 1)
- **Object Store**: `aliases`
  - Key path: `id` (auto-increment)
  - Fields: `{ id: number, name: string }`

### Key Functions

- `initializeDB()` - Creates IndexedDB schema on first load (mq.js:83)
- `addAlias(aliasValue)` - Stores new alias in IndexedDB (mq.js:126)
- `syncAliasList(hidden)` - Renders list as masked or revealed (mq.js:164)
- `shuffleAliasList()` - Randomizes display order using Fisher-Yates shuffle (mq.js:220)
- `clearAliases()` - Wipes all data from IndexedDB (mq.js:99)

### UI State Management

Navigation icons toggle based on application state:
- `#completeNavItem` - Visible during input phase
- `#showNavItem` - Visible after completion (when list is hidden)
- `#hideNavItem` - Visible when aliases are revealed
- `#aliasFormDiv` - Input form, hidden after completion

## Development

### Running Locally

Simply open `index.html` in a web browser. No build process required.

For PWA features (service worker), serve via HTTP server:
```bash
python -m http.server 8000
# or
npx http-server
```

### Testing PWA

1. Serve over HTTPS or localhost
2. Check Application > Service Workers in browser DevTools
3. Test offline functionality by going offline after initial load

### Modifying Cached Files

When changing files cached by the service worker, update `filesToCache` array in `sw.js:2` and consider updating `cacheName` in `sw.js:1` to force cache refresh.

## Important Notes

- All UI text is in German
- No backend server - entirely client-side with IndexedDB persistence
- Single-device usage pattern: one phone passed between players
- Privacy feature: aliases displayed as asterisks (`*************`) until completion phase
- Uses `jquery.disable-autofill.js` to prevent browser autofill interference