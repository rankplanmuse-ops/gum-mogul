# Gum Mogul 🍬⚡

**▶ Play it live: https://rankplanmuse-ops.github.io/gum-mogul/**

A free and open source bubblegum empire simulator that runs entirely in your
browser. Stock vending machines, bend demand with your prices, open new
locations, survive random events, and stack sats through a built-in
**Bitcoin Lightning Network** wallet simulation.

**Goal:** reach **$25,000 net worth** and become the Gum Mogul.
**Lose condition:** three days in a row with negative cash pops the bubble.

## What is in the game

- **Real business maths, taught by playing:** margins, price elasticity,
  rent, marketing ROI, card fees, depreciation and profit tax, all visible
  in a daily profit and loss panel.
- **An empire, not one machine:** 12 locations across two cities.
  Bubbleville: Corner Shop, School Gates, Bus Station, Arcade Alley,
  University Campus, Mega Mall, Beach Boardwalk, Airport Terminal.
  Opening the Airport unlocks Neon Bay: Ferry Pier, Neon Night Market,
  Tech District, and the Gum Mogul Kiosk, your own shop with room for
  5 machines. Plus purchasable machines, 7 gum flavours that unlock
  at revenue milestones, and 4 upgrades.
  Bulk supplier discounts (25+ gums 5% off, 50+ 10%, 100+ 15%) and a
  Restock Bot with four fill levels (Lean, Standard, Loaded, Max Out)
  reward players who plan their working capital.
- **A living market:** reputation, daily random events (viral videos,
  heatwaves, rival machines), stockouts that cost you customers, and a
  demand forecast for every product.
- **Lightning, showcased properly:**
  - Buy the Lightning Terminal and 45% of customers pay in sats: instant
    settlement, no 2.9% card fee.
  - Pay suppliers over Lightning for an 8% discount.
  - Create BOLT11-style invoices with QR codes and watch one settle.
  - Zap promos (+30% demand), sats selling, and a Lightning rescue loan
    that is repaid automatically out of your Lightning sales.
  - A daily Lightning fact, WebLN detection, and an optional real-world
    zap link to a Lightning Address. The game itself never touches real
    money or real keys; in-game sats are simulated at a round
    1,000 sats = $1 teaching rate.
- **Meta game:** 17 achievements, revenue and profit charts, an empire
  diary, auto-save to your browser, and auto-play for idle moguls.
- **Original 8-bit soundtrack:** a Game Boy style chiptune (square lead,
  triangle bass, noise hats) synthesized live with WebAudio from the
  speaker button. No audio files, nothing sampled: the loop is code.

## Run it

```sh
bun install   # or npm install
bun run dev   # or npm run dev
```

Build a static site (works on GitHub Pages, any static host, or a subfolder):

```sh
bun run build # outputs dist/
```

## Tech

React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui components, Recharts,
qrcode.react. No backend, no accounts, no tracking, no cookies. Saves live
in `localStorage` only.

## License

MIT. See [LICENSE](LICENSE). Fork it, reskin it, teach with it.

The vending machine photo in `src/assets/` ships with the original project
scaffold; swap it for your own art if you redistribute at scale.
