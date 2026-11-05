import { useState, useEffect, useRef } from "react";
import { VendingMachine } from "@/components/VendingMachine";
import { FinancialDashboard } from "@/components/FinancialDashboard";
import { ProductInventory } from "@/components/ProductInventory";
import { CostBreakdownPanel } from "@/components/CostBreakdownPanel";
import { LightningWalletPanel } from "@/components/LightningWalletPanel";
import { EmpirePanel } from "@/components/EmpirePanel";
import { InsightsPanel } from "@/components/InsightsPanel";
import { Button } from "@/components/ui/button";
import { GameState } from "@/types/game";
import {
  freshState, processDayEnd, purchaseStock, buyMachine, unlockLocation, buyUpgrade,
  zapPromo, takeRescueLoan, sellSats, receiveSats, forecastCosts, totalStock,
  stockCapacity, totalMachines, hasUpgrade, SAVE_KEY, ActionResult,
} from "@/lib/gameLogic";
import { Play, FastForward, RotateCcw, HelpCircle, X, Volume2, VolumeX } from "lucide-react";
import { chiptune, MUSIC_PREF_KEY } from "@/lib/music";
import { toast } from "sonner";

const loadSave = (): GameState => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.day === "number" && Array.isArray(parsed.products)) {
        const merged = { ...freshState(), ...parsed };
        // Locations added in later versions must appear in old saves:
        // keep the player's unlocked/machines for ids they already have.
        if (Array.isArray(parsed.locations)) {
          merged.locations = freshState().locations.map((fresh) => {
            const saved = parsed.locations.find((l: { id: string }) => l.id === fresh.id);
            return saved ? { ...fresh, unlocked: !!saved.unlocked, machines: saved.machines ?? fresh.machines } : fresh;
          });
        }
        return merged;
      }
    }
  } catch { /* corrupted save falls through to a fresh game */ }
  return freshState();
};

const BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3 + 3) % 100}%`,
  size: 14 + ((i * 13) % 44),
  delay: `${(i * 1.7) % 12}s`,
  duration: `${11 + (i % 5) * 3}s`,
}));

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(loadSave);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  // If the player left music on last visit, browsers still demand one
  // gesture before audio: the first click or tap anywhere starts it.
  useEffect(() => {
    let wanted = false;
    try { wanted = localStorage.getItem(MUSIC_PREF_KEY) === "on"; } catch { wanted = false; }
    if (!wanted) return;
    const kick = () => { chiptune.start(); setMusicOn(true); };
    window.addEventListener("pointerdown", kick, { once: true });
    return () => window.removeEventListener("pointerdown", kick);
  }, []);

  const toggleMusic = () => {
    const nowOn = chiptune.toggle();
    setMusicOn(nowOn);
    try { localStorage.setItem(MUSIC_PREF_KEY, nowOn ? "on" : "off"); } catch { /* ignore */ }
  };
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(gameState)); } catch { /* storage full/blocked: game still runs */ }
  }, [gameState]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const t = setInterval(() => {
      if (stateRef.current.gameOver) { setIsAutoPlaying(false); return; }
      setGameState((s) => processDayEnd(s));
    }, 1500);
    return () => clearInterval(t);
  }, [isAutoPlaying]);

  const costs = forecastCosts(gameState);
  const apply = (result: ActionResult) => {
    if (result.ok) { setGameState(result.state); toast.success(result.message); }
    else toast.error(result.message);
  };

  const handleNextDay = () => {
    const before = gameState;
    const after = processDayEnd(before);
    setGameState(after);
    const p = after.lastDay;
    if (p) {
      if (p.netProfit >= 0) toast.success(`Day ${before.day} done: +$${p.netProfit.toFixed(2)} profit${p.satsEarned > 0 ? `, +${p.satsEarned.toLocaleString()} sats ⚡` : ""}`);
      else toast.error(`Day ${before.day} done: $${Math.abs(p.netProfit).toFixed(2)} loss`);
    }
    after.achievements.filter((a) => !before.achievements.includes(a)).forEach(() => toast.success("🏆 Achievement unlocked! Check the trophy shelf.", { duration: 4000 }));
  };

  const handleReset = () => {
    if (!window.confirm("Pop the whole empire and start again from $100?")) return;
    localStorage.removeItem(SAVE_KEY);
    setGameState(freshState());
    setIsAutoPlaying(false);
    toast.info("Fresh start. One machine, big dreams.");
  };

  const breakdownCosts = gameState.lastDay
    ? { revenue: gameState.lastDay.revenue, productCost: gameState.lastDay.productCost, rent: gameState.lastDay.rent, marketing: gameState.lastDay.marketing, depreciation: gameState.lastDay.depreciation, cardFees: gameState.lastDay.cardFees, tax: gameState.lastDay.tax, netProfit: gameState.lastDay.netProfit }
    : costs;

  return (
    <div className="min-h-screen relative overflow-x-clip bg-gradient-to-b from-pink-100 via-rose-50 to-sky-100">
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        {BUBBLES.map((b, i) => (
          <span key={i} className="bubble" style={{ left: b.left, width: b.size, height: b.size, animationDelay: b.delay, animationDuration: b.duration }} />
        ))}
      </div>

      <button
        onClick={toggleMusic}
        aria-label={musicOn ? "Turn the 8-bit music off" : "Turn the 8-bit music on"}
        title={musicOn ? "Music: on (8-bit chiptune, synthesized live)" : "Music: off"}
        className={`fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 ${musicOn ? "bg-gradient-to-br from-fuchsia-500 to-amber-500 animate-floaty" : "bg-slate-500/85"}`}
      >
        {musicOn ? <Volume2 className="h-7 w-7" /> : <VolumeX className="h-7 w-7" />}
      </button>

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        <header className="text-center space-y-2">
          <div className="text-6xl animate-floaty inline-block">🍬</div>
          <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
            Gum Mogul
          </h1>
          <p className="text-lg font-bold text-muted-foreground">Build a bubblegum empire, one machine, one zap at a time. Reach $25,000 net worth and take the crown 👑</p>
          <button onClick={() => setShowHelp(!showHelp)} className="inline-flex items-center gap-1 font-black text-primary underline underline-offset-4">
            {showHelp ? <X className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />} How to play
          </button>
          {showHelp && (
            <div className="max-w-2xl mx-auto text-left bg-white/85 backdrop-blur rounded-3xl border-[3px] p-5 text-sm font-semibold space-y-2 animate-pop">
              <p>1. <strong>Stock the jars.</strong> Buy gum before customers arrive. Empty slots lose sales and reputation.</p>
              <p>2. <strong>Set prices.</strong> The slider bends demand: deals sell fast, greedy prices sell slow and dent your reputation.</p>
              <p>3. <strong>Hit Next Day.</strong> Sales land, rent, marketing, card fees and tax leave. Watch the diary for events.</p>
              <p>4. <strong>Grow.</strong> Unlock flavours at revenue milestones, open new locations, add machines, buy upgrades.</p>
              <p>5. <strong>Go Lightning ⚡.</strong> The $150 terminal lets customers pay in sats: instant, fee free. Pay suppliers in sats for 8% off, run zap promos, and if cash runs dry, a Lightning rescue loan can save the run.</p>
              <p>6. <strong>Do not go broke.</strong> Three days in a row with negative cash ends the game. Your progress auto-saves in this browser.</p>
              <p>🎵 <strong>Soundtrack:</strong> the speaker button (bottom right) plays an original 8-bit chiptune, synthesized live in your browser, Game Boy style. No audio files.</p>
            </div>
          )}
        </header>

        {gameState.mogulReached && (
          <div className="text-center bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 rounded-full py-3 px-6 font-black text-amber-900 text-lg shadow-lg animate-pop">
            👑 YOU ARE THE GUM MOGUL. $25,000 net worth reached. Sandbox mode now: how big can it get?
          </div>
        )}

        {gameState.pendingEvent && (
          <div className="bg-white/85 backdrop-blur rounded-full py-2.5 px-6 font-bold text-center shadow animate-pop">
            🔮 Tomorrow: {gameState.pendingEvent.icon} <strong>{gameState.pendingEvent.title}</strong> · demand x{gameState.pendingEvent.demandFactor}. {gameState.pendingEvent.text}
          </div>
        )}

        <FinancialDashboard gameState={gameState} dailyProfit={costs.netProfit} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <VendingMachine gumCount={totalStock(gameState)} capacity={stockCapacity(gameState)} machines={totalMachines(gameState)} />
            <div className="flex gap-3">
              <Button onClick={handleNextDay} disabled={isAutoPlaying || gameState.gameOver} className="flex-1 h-14 text-lg rounded-full font-black gap-2 shadow-lg">
                <Play className="h-5 w-5" /> Next Day
              </Button>
              <Button onClick={() => setIsAutoPlaying(!isAutoPlaying)} variant={isAutoPlaying ? "destructive" : "secondary"} className="flex-1 h-14 text-lg rounded-full font-black gap-2">
                <FastForward className="h-5 w-5" /> {isAutoPlaying ? "Stop Auto" : "Auto Play"}
              </Button>
              <Button onClick={handleReset} variant="outline" className="h-14 rounded-full gap-2 font-black px-5" title="Reset game: wipe the save and start over">
                <RotateCcw className="h-5 w-5" /> Reset game
              </Button>
            </div>
            <CostBreakdownPanel costs={breakdownCosts} title={gameState.lastDay ? `Yesterday (Day ${gameState.day - 1}) in numbers` : "Today, forecast"} lnShare={gameState.lastDay ? gameState.lastDay.lnShare : hasUpgrade(gameState, "ln-terminal") ? 0.45 : 0} />
          </div>
          <LightningWalletPanel
            gameState={gameState}
            onReceive={(amount, label) => { setGameState((s) => receiveSats(s, amount, label)); toast.success(`⚡ +${amount.toLocaleString()} sats settled`); }}
            onZapPromo={() => apply(zapPromo(gameState))}
            onSellSats={(amount) => apply(sellSats(gameState, amount))}
            onRescueLoan={() => apply(takeRescueLoan(gameState))}
          />
        </div>

        <ProductInventory
          gameState={gameState}
          onPurchase={(id, qty, method) => apply(purchaseStock(gameState, id, qty, method))}
          onPriceChange={(id, price) => setGameState((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, sellPrice: price } : p)) }))}
        />

        <EmpirePanel
          gameState={gameState}
          onBuyMachine={(id) => apply(buyMachine(gameState, id))}
          onUnlockLocation={(id) => apply(unlockLocation(gameState, id))}
          onBuyUpgrade={(id) => apply(buyUpgrade(gameState, id))}
          onMarketingChange={(spend) => setGameState((s) => ({ ...s, marketingSpend: spend }))}
          onRestockLevelChange={(levelId) => { setGameState((s) => ({ ...s, restockLevel: levelId })); toast.success(`Restock Bot set to ${levelId}`); }}
        />

        <InsightsPanel gameState={gameState} />

        <footer className="text-center text-sm font-bold text-muted-foreground pb-4">
          Gum Mogul is free and open source software (MIT). The sats in game are simulated; the Lightning Network it teaches is very real. ⚡
        </footer>
      </div>

      {gameState.gameOver && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border-[4px] border-rose-300 max-w-md w-full p-8 text-center shadow-2xl animate-pop">
            <div className="text-6xl mb-3">💥</div>
            <h2 className="text-3xl font-black">The bubble popped</h2>
            <p className="font-semibold text-muted-foreground mt-2">Three days in the red. You reached day {gameState.day} with {`$${gameState.totalRevenue.toFixed(0)}`} lifetime revenue and {gameState.achievements.length} achievements.</p>
            <div className="space-y-2 mt-6">
              {!gameState.rescueUsed && hasUpgrade(gameState, "ln-terminal") && (
                <Button onClick={() => apply(takeRescueLoan(gameState))} className="w-full rounded-full font-black bg-amber-500 hover:bg-amber-600 h-12">
                  ⚡ Take the $200 Lightning rescue loan and keep going
                </Button>
              )}
              <Button onClick={handleReset} className="w-full rounded-full font-black h-12">Start a fresh empire</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
