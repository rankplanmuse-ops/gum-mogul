export interface Product {
  id: string;
  name: string;
  emoji: string;
  color: string;
  costPrice: number;
  sellPrice: number;
  refPrice: number;
  baseDemand: number;
  stock: number;
  unlocked: boolean;
  unlockRevenue?: number;
}

export interface Location {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  city: string;
  traffic: number;
  rentPerMachine: number;
  unlockCost: number;
  unlocked: boolean;
  machines: number;
  machineCap?: number; // defaults to the global cap; the kiosk shop fits more
  requiresLocation?: string; // another location that must be open first (city gate)
}

export interface Upgrade {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  cost: number;
  owned: boolean;
}

export interface DayRecord {
  day: number;
  revenue: number;
  netProfit: number;
  satsEarned: number;
  unitsSold: number;
}

export interface LogEntry {
  id: number;
  day: number;
  icon: string;
  text: string;
  kind: "info" | "event" | "ln" | "unlock" | "warn";
}

export interface LnTx {
  id: number;
  day: number;
  label: string;
  sats: number;
}

export interface GameEvent {
  id: string;
  icon: string;
  title: string;
  text: string;
  demandFactor: number;
}

export interface LastDaySummary {
  revenue: number;
  productCost: number;
  rent: number;
  marketing: number;
  depreciation: number;
  cardFees: number;
  tax: number;
  netProfit: number;
  satsEarned: number;
  unitsSold: number;
  unitsStockedOut: number;
  lnShare: number;
}

export interface GameState {
  cash: number;
  sats: number;
  totalRevenue: number;
  totalSatsEarned: number;
  day: number;
  machineValueEach: number;
  products: Product[];
  locations: Location[];
  upgrades: Upgrade[];
  marketingSpend: number;
  promoDays: Record<string, number>; // marketing channel id -> days of boost left
  bankLoan: number; // USD still owed to the Gum Bank, 0 = no loan
  bankLoanTier: string | null;
  restockLevel: string; // id into RESTOCK_LEVELS, used by the Restock Bot
  taxRate: number;
  depreciationRate: number;
  reputation: number;
  history: DayRecord[];
  log: LogEntry[];
  lnTx: LnTx[];
  achievements: string[];
  zapBoostDays: number;
  lnLoanSats: number;
  rescueUsed: boolean;
  negativeDays: number;
  gameOver: boolean;
  mogulReached: boolean;
  pendingEvent: GameEvent | null;
  lastDay: LastDaySummary | null;
}

export interface CostBreakdown {
  revenue: number;
  productCost: number;
  rent: number;
  marketing: number;
  depreciation: number;
  cardFees: number;
  tax: number;
  netProfit: number;
}
