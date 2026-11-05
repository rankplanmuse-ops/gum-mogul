import {
  GameState,
  Product,
  CostBreakdown,
  GameEvent,
  Location,
  Upgrade,
} from "@/types/game";

// ---- Constants the whole game is tuned around ------------------------------
export const SATS_PER_USD = 1000; // game rate, kept round so the maths is teachable
export const MACHINE_COST = 400;
export const MAX_MACHINES_PER_LOCATION = 3;
export const MACHINE_BASE_VALUE = 500;
export const MOGUL_NET_WORTH = 25000;
export const CARD_FEE_RATE = 0.029; // what card sales cost you
export const LN_CUSTOMER_SHARE = 0.45; // share of sales paid over Lightning once you own a terminal
export const LN_SUPPLIER_DISCOUNT = 0.08; // paying suppliers over Lightning is 8% cheaper
export const ZAP_PROMO_COST_SATS = 5000;
export const RESCUE_LOAN_USD = 200;
export const RESCUE_LOAN_SATS = 220000; // $200 at game rate, plus 10%
export const SAVE_KEY = "gum-mogul-save-v2";

export const INITIAL_PRODUCTS: Product[] = [
  { id: "basic", name: "Classic Gum", emoji: "🩷", color: "from-pink-400 to-rose-500", costPrice: 0.1, sellPrice: 0.25, refPrice: 0.25, baseDemand: 20, stock: 0, unlocked: true },
  { id: "premium", name: "Mint Fresh Pro", emoji: "🌿", color: "from-emerald-400 to-teal-500", costPrice: 0.3, sellPrice: 0.75, refPrice: 0.75, baseDemand: 12, stock: 0, unlocked: true },
  { id: "deluxe", name: "Berry Blast", emoji: "🫐", color: "from-violet-400 to-purple-600", costPrice: 0.5, sellPrice: 1.5, refPrice: 1.5, baseDemand: 8, stock: 0, unlocked: true },
  { id: "superior", name: "Citrus Supreme", emoji: "🍋", color: "from-amber-300 to-orange-500", costPrice: 0.8, sellPrice: 2.25, refPrice: 2.25, baseDemand: 5, stock: 0, unlocked: true },
  { id: "luxury", name: "Diamond Bubble", emoji: "💎", color: "from-sky-300 to-blue-500", costPrice: 1.5, sellPrice: 4.5, refPrice: 4.5, baseDemand: 3, stock: 0, unlocked: false, unlockRevenue: 300 },
  { id: "exclusive", name: "Platinum Chew", emoji: "👑", color: "from-slate-300 to-slate-500", costPrice: 3.0, sellPrice: 9.0, refPrice: 9.0, baseDemand: 2, stock: 0, unlocked: false, unlockRevenue: 800 },
  { id: "cosmic", name: "Cosmic Cola Fizz", emoji: "🚀", color: "from-fuchsia-400 to-pink-600", costPrice: 5.0, sellPrice: 15.0, refPrice: 15.0, baseDemand: 1, stock: 0, unlocked: false, unlockRevenue: 3000 },
];

export const INITIAL_LOCATIONS: Location[] = [
  { id: "corner", name: "Corner Shop", emoji: "🏪", blurb: "Your first spot. Steady locals, kind rent.", traffic: 1.0, rentPerMachine: 5, unlockCost: 0, unlocked: true, machines: 1 },
  { id: "school", name: "School Gates", emoji: "🎒", blurb: "Recess rushes. Berry Blast flies off the shelf.", traffic: 1.4, rentPerMachine: 8, unlockCost: 200, unlocked: false, machines: 0 },
  { id: "arcade", name: "Arcade Alley", emoji: "🕹️", blurb: "Token rich, gum hungry, open late.", traffic: 2.0, rentPerMachine: 14, unlockCost: 600, unlocked: false, machines: 0 },
  { id: "mall", name: "Mega Mall", emoji: "🛍️", blurb: "Weekend crowds and premium tastes.", traffic: 2.6, rentPerMachine: 22, unlockCost: 1500, unlocked: false, machines: 0 },
  { id: "airport", name: "Airport Terminal", emoji: "✈️", blurb: "Captive audience, mogul money.", traffic: 3.4, rentPerMachine: 35, unlockCost: 4000, unlocked: false, machines: 0 },
];

export const INITIAL_UPGRADES: Upgrade[] = [
  { id: "ln-terminal", name: "Lightning Terminal", emoji: "⚡", blurb: "Accept Lightning in every machine. 45% of customers pay in sats: instant, no 2.9% card fee. Unlocks Lightning supplier payments, zap promos and rescue loans.", cost: 150, owned: false },
  { id: "big-jar", name: "Big Jar", emoji: "🫙", blurb: "+60% stock capacity in every machine.", cost: 120, owned: false },
  { id: "neon", name: "Neon Sign", emoji: "💡", blurb: "+15% demand everywhere, forever. Very bubbly.", cost: 200, owned: false },
  { id: "auto-restock", name: "Restock Bot", emoji: "🤖", blurb: "Every morning the bot tops stock up to the demand forecast, if you can afford it.", cost: 350, owned: false },
];

export const EVENTS: GameEvent[] = [
  { id: "viral", icon: "📱", title: "Viral video!", text: "A kid blew a record bubble with your gum. Everyone wants some tomorrow.", demandFactor: 1.5 },
  { id: "heatwave", icon: "🌞", title: "Heatwave", text: "Mint flavours feel like air conditioning tomorrow.", demandFactor: 1.25 },
  { id: "school-trip", icon: "🚌", title: "School trip day", text: "Half your regulars are at the zoo tomorrow. Quieter day.", demandFactor: 0.7 },
  { id: "rain", icon: "🌧️", title: "Rainy day", text: "Foot traffic stays home tomorrow.", demandFactor: 0.8 },
  { id: "payday", icon: "💸", title: "Payday Friday", text: "Pockets are full tomorrow. Premium gum moves.", demandFactor: 1.3 },
  { id: "rival", icon: "🥊", title: "Rival machine", text: "A rival parks a machine across the street tomorrow.", demandFactor: 0.75 },
  { id: "festival", icon: "🎪", title: "Street festival", text: "The whole neighbourhood walks past your machines tomorrow.", demandFactor: 1.6 },
  { id: "exam", icon: "📚", title: "Exam week", text: "Stressed students chew through stock tomorrow.", demandFactor: 1.2 },
  { id: "jam", icon: "🔧", title: "Sticky mechanism", text: "One machine jams at random tomorrow. Demand dips a little.", demandFactor: 0.9 },
  { id: "dentist", icon: "🦷", title: "Dentist week", text: "The local dentist is running an anti-gum campaign tomorrow.", demandFactor: 0.85 },
];

export interface Achievement {
  id: string;
  emoji: string;
  name: string;
  desc: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-sale", emoji: "🎉", name: "First Sale", desc: "Sell your first gum" },
  { id: "rev-500", emoji: "💵", name: "Side Hustle", desc: "$500 total revenue" },
  { id: "rev-5000", emoji: "💰", name: "Real Business", desc: "$5,000 total revenue" },
  { id: "rev-25000", emoji: "🏦", name: "Gum Empire", desc: "$25,000 total revenue" },
  { id: "machines-3", emoji: "🎰", name: "Triplets", desc: "Own 3 machines" },
  { id: "machines-6", emoji: "🏭", name: "Fleet Owner", desc: "Own 6 machines" },
  { id: "locations-3", emoji: "🗺️", name: "On The Map", desc: "Open 3 locations" },
  { id: "ln-terminal", emoji: "⚡", name: "Lightning Ready", desc: "Buy the Lightning Terminal" },
  { id: "sats-10000", emoji: "🟠", name: "Sats Stacker", desc: "Earn 10,000 sats all time" },
  { id: "sats-100000", emoji: "🚀", name: "Sats Whale", desc: "Earn 100,000 sats all time" },
  { id: "rep-90", emoji: "😍", name: "Loved", desc: "Reach 90 reputation" },
  { id: "day-30", emoji: "📅", name: "Survivor", desc: "Reach day 30" },
  { id: "day-100", emoji: "🏆", name: "Century", desc: "Reach day 100" },
  { id: "mogul", emoji: "👑", name: "GUM MOGUL", desc: `Reach $${MOGUL_NET_WORTH.toLocaleString()} net worth` },
];

let idCounter = 1;
const nextId = () => idCounter++ + Date.now() % 100000;

export const freshState = (): GameState => ({
  cash: 100,
  sats: 1000,
  totalRevenue: 0,
  totalSatsEarned: 0,
  day: 1,
  machineValueEach: MACHINE_BASE_VALUE,
  products: INITIAL_PRODUCTS.map((p) => ({ ...p })),
  locations: INITIAL_LOCATIONS.map((l) => ({ ...l })),
  upgrades: INITIAL_UPGRADES.map((u) => ({ ...u })),
  marketingSpend: 3,
  taxRate: 0.15,
  depreciationRate: 0.01,
  reputation: 50,
  history: [],
  log: [
    { id: nextId(), day: 1, icon: "⚡", text: "A fan zapped 1,000 sats to your tip jar. Lightning is fast, huh?", kind: "ln" },
    { id: nextId(), day: 1, icon: "🍬", text: "Welcome, future Gum Mogul. Stock the machine, set your prices, hit Next Day.", kind: "info" },
  ],
  lnTx: [{ id: nextId(), day: 1, label: "Tip jar zap from a fan", sats: 1000 }],
  achievements: [],
  zapBoostDays: 0,
  lnLoanSats: 0,
  rescueUsed: false,
  negativeDays: 0,
  gameOver: false,
  mogulReached: false,
  pendingEvent: null,
  lastDay: null,
});

export const INITIAL_GAME_STATE: GameState = freshState();

// ---- Derived helpers ---------------------------------------------------------
export const hasUpgrade = (s: GameState, id: string) =>
  s.upgrades.find((u) => u.id === id)?.owned ?? false;

export const totalMachines = (s: GameState) =>
  s.locations.reduce((n, l) => n + l.machines, 0);

export const trafficUnits = (s: GameState) =>
  s.locations.reduce((n, l) => n + l.machines * l.traffic, 0);

export const dailyRent = (s: GameState) =>
  s.locations.reduce((n, l) => n + l.machines * l.rentPerMachine, 0);

export const stockCapacity = (s: GameState) =>
  Math.round(totalMachines(s) * 150 * (hasUpgrade(s, "big-jar") ? 1.6 : 1));

export const totalStock = (s: GameState) =>
  s.products.reduce((n, p) => n + p.stock, 0);

export const netWorth = (s: GameState) =>
  s.cash +
  s.sats / SATS_PER_USD +
  totalMachines(s) * s.machineValueEach +
  s.products.reduce((n, p) => n + p.stock * p.costPrice, 0) -
  s.lnLoanSats / SATS_PER_USD;

export const priceFactor = (p: Product) => {
  const f = Math.pow(p.refPrice / Math.max(0.01, p.sellPrice), 1.6);
  return Math.min(2.8, Math.max(0.15, f));
};

export const forecastDemand = (s: GameState, p: Product): number => {
  if (!p.unlocked) return 0;
  const marketing = 1 + s.marketingSpend * 0.018;
  const reputation = 0.7 + (s.reputation / 100) * 0.6;
  const neon = hasUpgrade(s, "neon") ? 1.15 : 1;
  const event = s.pendingEvent?.demandFactor ?? 1;
  const zap = s.zapBoostDays > 0 ? 1.3 : 1;
  return p.baseDemand * trafficUnits(s) * priceFactor(p) * marketing * reputation * neon * event * zap;
};

const pushLog = (s: GameState, icon: string, text: string, kind: GameState["log"][number]["kind"]) => {
  s.log = [{ id: nextId(), day: s.day, icon, text, kind }, ...s.log].slice(0, 60);
};

// ---- Achievements --------------------------------------------------------------
export const unlockAchievements = (input: GameState): GameState => {
  const s = { ...input };
  const checks: [string, boolean][] = [
    ["first-sale", s.totalRevenue > 0],
    ["rev-500", s.totalRevenue >= 500],
    ["rev-5000", s.totalRevenue >= 5000],
    ["rev-25000", s.totalRevenue >= 25000],
    ["machines-3", totalMachines(s) >= 3],
    ["machines-6", totalMachines(s) >= 6],
    ["locations-3", s.locations.filter((l) => l.unlocked).length >= 3],
    ["ln-terminal", hasUpgrade(s, "ln-terminal")],
    ["sats-10000", s.totalSatsEarned >= 10000],
    ["sats-100000", s.totalSatsEarned >= 100000],
    ["rep-90", s.reputation >= 90],
    ["day-30", s.day >= 30],
    ["day-100", s.day >= 100],
    ["mogul", netWorth(s) >= MOGUL_NET_WORTH],
  ];
  const fresh = checks.filter(([id, ok]) => ok && !s.achievements.includes(id)).map(([id]) => id);
  if (fresh.length) {
    s.achievements = [...s.achievements, ...fresh];
    s.log = [...s.log];
    fresh.forEach((id) => {
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      if (a) pushLog(s, a.emoji, `Achievement unlocked: ${a.name} (${a.desc})`, "unlock");
    });
    if (fresh.includes("mogul")) s.mogulReached = true;
  }
  return s;
};

// ---- Buying --------------------------------------------------------------------
export interface ActionResult {
  state: GameState;
  ok: boolean;
  message: string;
}

export const purchaseStock = (
  state: GameState,
  productId: string,
  quantity: number,
  payMethod: "cash" | "sats"
): ActionResult => {
  const product = state.products.find((p) => p.id === productId);
  if (!product || quantity <= 0) return { state, ok: false, message: "Pick a quantity first" };
  if (totalStock(state) + quantity > stockCapacity(state))
    return { state, ok: false, message: `Jar is full. Capacity is ${stockCapacity(state)} units (Big Jar upgrade helps)` };

  const costUsd = product.costPrice * quantity;
  const s = { ...state, products: state.products.map((p) => ({ ...p })), lnTx: [...state.lnTx], log: [...state.log] };

  if (payMethod === "sats") {
    if (!hasUpgrade(state, "ln-terminal"))
      return { state, ok: false, message: "Buy the Lightning Terminal upgrade to pay suppliers in sats" };
    const costSats = Math.ceil(costUsd * SATS_PER_USD * (1 - LN_SUPPLIER_DISCOUNT));
    if (costSats > state.sats) return { state, ok: false, message: `Not enough sats (needs ${costSats.toLocaleString()})` };
    s.sats -= costSats;
    s.lnTx = [{ id: nextId(), day: s.day, label: `Supplier: ${quantity}x ${product.name} (8% Lightning discount)`, sats: -costSats }, ...s.lnTx].slice(0, 40);
  } else {
    if (costUsd > state.cash) return { state, ok: false, message: "Not enough cash" };
    s.cash -= costUsd;
  }
  const target = s.products.find((p) => p.id === productId)!;
  target.stock += quantity;
  return { state: s, ok: true, message: `Stocked ${quantity}x ${product.name}` };
};

export const buyMachine = (state: GameState, locationId: string): ActionResult => {
  const loc = state.locations.find((l) => l.id === locationId);
  if (!loc?.unlocked) return { state, ok: false, message: "Open that location first" };
  if (loc.machines >= MAX_MACHINES_PER_LOCATION) return { state, ok: false, message: `${loc.name} is full: ${MAX_MACHINES_PER_LOCATION} machines max per location` };
  if (state.cash < MACHINE_COST) return { state, ok: false, message: `A machine costs $${MACHINE_COST}` };
  const s = { ...state, locations: state.locations.map((l) => ({ ...l })), log: [...state.log] };
  s.cash -= MACHINE_COST;
  s.locations.find((l) => l.id === locationId)!.machines += 1;
  pushLog(s, "🎰", `New machine installed at ${loc.name}. Capacity and demand up.`, "info");
  return { state: unlockAchievements(s), ok: true, message: `Machine installed at ${loc.name}` };
};

export const unlockLocation = (state: GameState, locationId: string): ActionResult => {
  const loc = state.locations.find((l) => l.id === locationId);
  if (!loc || loc.unlocked) return { state, ok: false, message: "Already open" };
  if (state.cash < loc.unlockCost + MACHINE_COST)
    return { state, ok: false, message: `Needs $${loc.unlockCost} to open plus $${MACHINE_COST} for its first machine` };
  const s = { ...state, locations: state.locations.map((l) => ({ ...l })), log: [...state.log] };
  s.cash -= loc.unlockCost + MACHINE_COST;
  const target = s.locations.find((l) => l.id === locationId)!;
  target.unlocked = true;
  target.machines = 1;
  pushLog(s, loc.emoji, `${loc.name} is OPEN, first machine installed. ${loc.blurb}`, "unlock");
  return { state: unlockAchievements(s), ok: true, message: `${loc.name} opened` };
};

export const buyUpgrade = (state: GameState, upgradeId: string): ActionResult => {
  const up = state.upgrades.find((u) => u.id === upgradeId);
  if (!up || up.owned) return { state, ok: false, message: "Already owned" };
  if (state.cash < up.cost) return { state, ok: false, message: `Costs $${up.cost}` };
  const s = { ...state, upgrades: state.upgrades.map((u) => ({ ...u })), log: [...state.log] };
  s.cash -= up.cost;
  s.upgrades.find((u) => u.id === upgradeId)!.owned = true;
  pushLog(s, up.emoji, `Upgrade bought: ${up.name}. ${up.blurb}`, "unlock");
  return { state: unlockAchievements(s), ok: true, message: `${up.name} installed` };
};

// ---- Lightning actions -----------------------------------------------------------
export const makeSimInvoice = (amountSats: number, memo: string) => {
  const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  let tail = "";
  for (let i = 0; i < 120; i++) tail += charset[Math.floor(Math.random() * charset.length)];
  return { bolt11: `lnbc${Math.round(amountSats / 10)}n1${tail}`, memo, amountSats };
};

export const receiveSats = (state: GameState, amount: number, label: string): GameState => {
  const s = { ...state, lnTx: [...state.lnTx], log: [...state.log] };
  s.sats += amount;
  s.totalSatsEarned += amount;
  s.lnTx = [{ id: nextId(), day: s.day, label, sats: amount }, ...s.lnTx].slice(0, 40);
  pushLog(s, "⚡", `${label}: +${amount.toLocaleString()} sats, settled in seconds.`, "ln");
  return unlockAchievements(s);
};

export const zapPromo = (state: GameState): ActionResult => {
  if (!hasUpgrade(state, "ln-terminal")) return { state, ok: false, message: "Needs the Lightning Terminal" };
  if (state.sats < ZAP_PROMO_COST_SATS) return { state, ok: false, message: `Zap promo costs ${ZAP_PROMO_COST_SATS.toLocaleString()} sats` };
  const s = { ...state, lnTx: [...state.lnTx], log: [...state.log] };
  s.sats -= ZAP_PROMO_COST_SATS;
  s.zapBoostDays = Math.max(s.zapBoostDays, 2);
  s.lnTx = [{ id: nextId(), day: s.day, label: "Zap promo: sponsored posts on Nostr", sats: -ZAP_PROMO_COST_SATS }, ...s.lnTx].slice(0, 40);
  pushLog(s, "📣", "Zap promo live: +30% demand for 2 days. The internet loves a zap.", "ln");
  return { state: s, ok: true, message: "Zap promo live for 2 days" };
};

export const takeRescueLoan = (state: GameState): ActionResult => {
  if (state.rescueUsed) return { state, ok: false, message: "The community already rescued you once" };
  if (!hasUpgrade(state, "ln-terminal")) return { state, ok: false, message: "Rescue loans ride Lightning: buy the Terminal first" };
  const s = { ...state, lnTx: [...state.lnTx], log: [...state.log] };
  s.cash += RESCUE_LOAN_USD;
  s.lnLoanSats += RESCUE_LOAN_SATS;
  s.rescueUsed = true;
  s.gameOver = false;
  s.negativeDays = 0;
  s.lnTx = [{ id: nextId(), day: s.day, label: `Lightning rescue loan received ($${RESCUE_LOAN_USD})`, sats: 0 }, ...s.lnTx].slice(0, 40);
  pushLog(s, "🛟", `Rescue loan: $${RESCUE_LOAN_USD} landed instantly over Lightning. You owe ${RESCUE_LOAN_SATS.toLocaleString()} sats, repaid automatically from 25% of your Lightning sales.`, "ln");
  return { state: s, ok: true, message: "Rescue loan received" };
};

export const sellSats = (state: GameState, amount: number): ActionResult => {
  if (amount <= 0 || amount > state.sats) return { state, ok: false, message: "Not enough sats" };
  const s = { ...state, lnTx: [...state.lnTx] };
  s.sats -= amount;
  s.cash += amount / SATS_PER_USD;
  s.lnTx = [{ id: nextId(), day: s.day, label: "Sold sats for cash", sats: -amount }, ...s.lnTx].slice(0, 40);
  return { state: s, ok: true, message: `Sold ${amount.toLocaleString()} sats` };
};

// ---- The day engine ----------------------------------------------------------------
export const processDayEnd = (input: GameState, rand: () => number = Math.random): GameState => {
  const s: GameState = {
    ...input,
    products: input.products.map((p) => ({ ...p })),
    locations: input.locations.map((l) => ({ ...l })),
    upgrades: input.upgrades.map((u) => ({ ...u })),
    history: [...input.history],
    log: [...input.log],
    lnTx: [...input.lnTx],
    achievements: [...input.achievements],
  };
  const finishedDay = s.day;

  // Restock Bot does its morning round before sales.
  if (hasUpgrade(s, "auto-restock")) {
    for (const p of s.products) {
      if (!p.unlocked) continue;
      const want = Math.ceil(forecastDemand(s, p) * 1.1);
      const need = Math.max(0, want - p.stock);
      const room = stockCapacity(s) - totalStock(s);
      const qty = Math.min(need, room, Math.floor(s.cash / p.costPrice));
      if (qty > 0) {
        p.stock += qty;
        s.cash -= qty * p.costPrice;
      }
    }
  }

  let revenue = 0, productCost = 0, unitsSold = 0, stockedOut = 0;
  for (const p of s.products) {
    if (!p.unlocked) continue;
    const mean = forecastDemand(s, p);
    const demand = Math.round(mean * (0.78 + rand() * 0.44));
    const sold = Math.min(p.stock, demand);
    stockedOut += demand - sold;
    p.stock -= sold;
    unitsSold += sold;
    revenue += sold * p.sellPrice;
    productCost += sold * p.costPrice;
  }

  const lnShare = hasUpgrade(s, "ln-terminal") ? LN_CUSTOMER_SHARE : 0;
  const lnRevenue = revenue * lnShare;
  const satsGross = Math.round(lnRevenue * SATS_PER_USD);
  let loanRepay = 0;
  if (s.lnLoanSats > 0 && satsGross > 0) {
    loanRepay = Math.min(s.lnLoanSats, Math.floor(satsGross * 0.25));
    s.lnLoanSats -= loanRepay;
  }
  const satsEarned = satsGross - loanRepay;
  s.sats += satsEarned;
  s.totalSatsEarned += satsGross;
  if (satsGross > 0) {
    s.lnTx = [{ id: nextId(), day: finishedDay, label: loanRepay > 0 ? `Lightning sales (loan repaid ${loanRepay.toLocaleString()} sats)` : "Lightning sales, settled instantly", sats: satsEarned }, ...s.lnTx].slice(0, 40);
  }

  const rent = dailyRent(s);
  const depreciation = totalMachines(s) * s.machineValueEach * s.depreciationRate;
  const cardFees = (revenue - lnRevenue) * CARD_FEE_RATE;
  const taxable = Math.max(0, revenue - productCost - rent - s.marketingSpend - depreciation - cardFees);
  const tax = taxable * s.taxRate;
  const netProfit = revenue - productCost - rent - s.marketingSpend - depreciation - cardFees - tax;

  // Cash moves on real cash flows only: card+fiat sales land in the till,
  // Lightning sales land in the sats wallet, depreciation is value loss, not cash.
  s.cash += revenue - lnRevenue - rent - s.marketingSpend - cardFees - tax;
  s.machineValueEach = Math.max(100, s.machineValueEach - s.machineValueEach * s.depreciationRate);
  s.totalRevenue += revenue;

  // Reputation: empty slots hurt, fair prices and full jars help.
  let rep = s.reputation;
  if (unitsSold === 0) rep -= 6;
  else if (stockedOut === 0) rep += 2;
  else rep -= Math.min(12, Math.ceil(stockedOut / 2));
  const avgFactor = s.products.filter((p) => p.unlocked).reduce((n, p) => n + priceFactor(p), 0) / Math.max(1, s.products.filter((p) => p.unlocked).length);
  if (avgFactor < 0.75) rep -= 3;
  if (avgFactor >= 0.95) rep += 1;
  s.reputation = Math.min(100, Math.max(5, rep));

  // Product unlocks
  for (const p of s.products) {
    if (!p.unlocked && p.unlockRevenue && s.totalRevenue >= p.unlockRevenue) {
      p.unlocked = true;
      pushLog(s, "🔓", `New gum unlocked: ${p.emoji} ${p.name}. Stock it tomorrow.`, "unlock");
    }
  }

  s.lastDay = {
    revenue, productCost, rent, marketing: s.marketingSpend, depreciation, cardFees, tax,
    netProfit, satsEarned, unitsSold, unitsStockedOut: stockedOut, lnShare,
  };
  s.history = [...s.history, { day: finishedDay, revenue, netProfit, satsEarned, unitsSold }].slice(-60);

  if (s.pendingEvent) pushLog(s, s.pendingEvent.icon, `${s.pendingEvent.title}: ${s.pendingEvent.text}`, "event");
  if (stockedOut > 0) pushLog(s, "😢", `${stockedOut} customers found an empty slot today. Restock!`, "warn");
  pushLog(s, netProfit >= 0 ? "📈" : "📉", `Day ${finishedDay}: sold ${unitsSold} gums for $${revenue.toFixed(2)}, profit $${netProfit.toFixed(2)}${satsEarned > 0 ? `, +${satsEarned.toLocaleString()} sats` : ""}.`, "info");

  // Roll tomorrow's event: about half of days get one.
  s.pendingEvent = rand() < 0.5 ? EVENTS[Math.floor(rand() * EVENTS.length)] : null;
  if (s.pendingEvent) pushLog(s, "🔮", `Tomorrow: ${s.pendingEvent.icon} ${s.pendingEvent.title} (demand x${s.pendingEvent.demandFactor})`, "event");

  if (s.zapBoostDays > 0) s.zapBoostDays -= 1;

  s.day += 1;
  if (s.cash < 0) {
    s.negativeDays += 1;
    pushLog(s, "⚠️", `Cash is negative (${s.negativeDays}/3). Three red days in a row ends the run.`, "warn");
    if (s.negativeDays >= 3) s.gameOver = true;
  } else s.negativeDays = 0;

  return unlockAchievements(s);
};

export const forecastCosts = (s: GameState): CostBreakdown => {
  // Expected-value preview at forecast demand (no randomness), for the P&L panel.
  let revenue = 0, productCost = 0;
  for (const p of s.products) {
    const sold = Math.min(p.stock, Math.round(forecastDemand(s, p)));
    revenue += sold * p.sellPrice;
    productCost += sold * p.costPrice;
  }
  const lnRevenue = revenue * (hasUpgrade(s, "ln-terminal") ? LN_CUSTOMER_SHARE : 0);
  const rent = dailyRent(s);
  const depreciation = totalMachines(s) * s.machineValueEach * s.depreciationRate;
  const cardFees = (revenue - lnRevenue) * CARD_FEE_RATE;
  const taxable = Math.max(0, revenue - productCost - rent - s.marketingSpend - depreciation - cardFees);
  const tax = taxable * s.taxRate;
  return { revenue, productCost, rent, marketing: s.marketingSpend, depreciation, cardFees, tax, netProfit: revenue - productCost - rent - s.marketingSpend - depreciation - cardFees - tax };
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export const formatSats = (sats: number): string => `${Math.round(sats).toLocaleString()} sats`;
