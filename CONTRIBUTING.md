# Contributing to Gum Mogul

Thanks for popping by. Gum Mogul is a small, dependency-light browser game,
and contributions of every size are welcome.

## Getting started

```sh
npm install
npm run dev     # local dev server
npm run build   # production build into dist/
```

## Where things live

- `src/lib/gameLogic.ts` is the whole game engine: day processing, demand,
  Lightning mechanics, achievements. It is pure and testable, keep it that way.
- `src/types/game.ts` holds the state shape. The save key in localStorage is
  versioned (`gum-mogul-save-v2`); bump it if you change the shape.
- `src/components/` are presentational panels that receive state and callbacks.

## House rules

- No backend, no tracking, no cookies. Saves stay in localStorage.
- The Lightning wallet is a simulation on purpose: never add real keys,
  real seed phrases, or custodial money handling to the game.
- Keep the maths teachable: if you retune the economy, leave a comment with
  the reasoning and run a few seeded days to check the game is still winnable
  and still losable.
- New dependencies should be permissively licensed (MIT, ISC, Apache-2.0,
  BSD) so the project stays cleanly FOSS.

## License

By contributing, you agree your contributions are licensed under the
project's MIT license.
