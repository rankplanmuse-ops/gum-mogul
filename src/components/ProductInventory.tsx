import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GameState } from "@/types/game";
import { formatCurrency, forecastDemand, hasUpgrade, SATS_PER_USD, LN_SUPPLIER_DISCOUNT, bulkDiscountFor, purchaseFactor } from "@/lib/gameLogic";
import { Lock, ShoppingCart, Zap, DollarSign } from "lucide-react";
import { useState } from "react";

interface Props {
  gameState: GameState;
  onPurchase: (productId: string, quantity: number, method: "cash" | "sats") => void;
  onPriceChange: (productId: string, price: number) => void;
}

export const ProductInventory = ({ gameState, onPurchase, onPriceChange }: Props) => {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<"cash" | "sats">("cash");
  const lnReady = hasUpgrade(gameState, "ln-terminal");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-black">🍬 The Gum Lineup</h2>
        <div className="flex rounded-full bg-white border-[3px] overflow-hidden shadow">
          <button onClick={() => setMethod("cash")} className={`px-4 py-2 font-black flex items-center gap-1 ${method === "cash" ? "bg-primary text-white" : "text-muted-foreground"}`}>
            <DollarSign className="h-4 w-4" /> Cash
          </button>
          <button onClick={() => lnReady && setMethod("sats")} disabled={!lnReady} className={`px-4 py-2 font-black flex items-center gap-1 ${method === "sats" ? "bg-amber-400 text-white" : "text-muted-foreground"} disabled:opacity-40`} title={lnReady ? "Pay suppliers over Lightning, 8% cheaper" : "Buy the Lightning Terminal upgrade first"}>
            <Zap className="h-4 w-4" /> Sats -8%
          </button>
        </div>
      </div>
      <p className="text-sm font-semibold text-muted-foreground -mt-2">Set your price with the slider. Cheaper sells more, pricier earns more per gum, until customers walk away. Forecast shows expected sales tomorrow. <strong className="text-accent">Bulk discounts: 25+ gums 5% off, 50+ 10% off, 100+ 15% off</strong>, on cash and sats orders alike.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gameState.products.map((p) => {
          if (!p.unlocked) {
            return (
              <Card key={p.id} className="bubbly-card p-6 border-dashed opacity-70 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="gumball w-14 h-14 bg-gradient-to-br from-slate-300 to-slate-400 grayscale">{p.emoji}</div>
                  <div>
                    <h3 className="font-black flex items-center gap-2"><Lock className="h-4 w-4" /> {p.name}</h3>
                    <p className="text-sm font-semibold text-muted-foreground">Unlocks at {formatCurrency(p.unlockRevenue || 0)} total revenue</p>
                  </div>
                </div>
              </Card>
            );
          }
          const forecast = Math.round(forecastDemand(gameState, p));
          const margin = p.sellPrice - p.costPrice;
          const q = qty[p.id] ?? 10;
          const bulk = bulkDiscountFor(q);
          const costUsd = p.costPrice * q * (1 - bulk) * purchaseFactor(gameState);
          const costSats = Math.ceil(costUsd * SATS_PER_USD * (1 - LN_SUPPLIER_DISCOUNT));
          const low = p.stock < forecast;
          const step = p.refPrice < 1 ? 0.05 : 0.25;
          return (
            <Card key={p.id} className="bubbly-card p-5 hover:-translate-y-1 transition-transform">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`gumball w-14 h-14 bg-gradient-to-br ${p.color} animate-wiggle-hover`}>{p.emoji}</div>
                  <div>
                    <h3 className="font-black leading-tight">{p.name}</h3>
                    <p className="text-xs font-bold text-muted-foreground">cost {formatCurrency(p.costPrice)} · unit margin <span className={margin / p.sellPrice >= 0.5 ? "text-accent" : margin / p.sellPrice >= 0.25 ? "text-amber-600" : "text-rose-600"}>{formatCurrency(margin)} ({Math.round((margin / p.sellPrice) * 100)}%)</span></p>
                  </div>
                </div>
                <div className={`text-right ${low ? "text-loss" : "text-primary"}`}>
                  <p className="text-2xl font-black leading-none">{p.stock}</p>
                  <p className="text-[11px] font-bold uppercase">in stock</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs font-black uppercase text-muted-foreground">
                  <span>Your price</span>
                  <span className={p.sellPrice > p.refPrice * 1.3 ? "text-loss" : p.sellPrice < p.refPrice ? "text-accent" : ""}>
                    {formatCurrency(p.sellPrice)} {p.sellPrice > p.refPrice * 1.3 ? "(pricey!)" : p.sellPrice < p.refPrice ? "(deal!)" : "(sweet spot)"}
                  </span>
                </div>
                <Slider value={[p.sellPrice]} min={Math.max(0.05, p.costPrice * 0.5)} max={p.refPrice * 2.5} step={step}
                  onValueChange={([v]) => onPriceChange(p.id, Math.round(v * 100) / 100)} className="mt-2" />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => onPriceChange(p.id, Math.round(p.costPrice * 1.15 * 100) / 100)} className="flex-1 rounded-full border-2 border-amber-300 bg-amber-50 px-2 py-1.5 text-[11px] font-black text-amber-800 transition-transform hover:-translate-y-0.5" title="Slim 15% margin over cost: cheap enough to move serious volume">
                    🔥 Super Deal (cost +15%)
                  </button>
                  <button onClick={() => onPriceChange(p.id, Math.round(p.costPrice * 0.9 * 100) / 100)} className="flex-1 rounded-full border-2 border-rose-300 bg-rose-50 px-2 py-1.5 text-[11px] font-black text-rose-800 transition-transform hover:-translate-y-0.5" title="Sell 10% under cost: every unit loses a little money and buys reputation and foot traffic">
                    🎁 Loss Leader (cost -10%)
                  </button>
                </div>
                {p.sellPrice <= p.costPrice ? (
                  <p className="text-xs font-black text-rose-600 mt-1.5">🎁 LOSS LEADER: losing {formatCurrency(p.costPrice - p.sellPrice)}/unit on purpose. Volume buys reputation (up to +4/day) and pulls crowds past your other gums.</p>
                ) : margin / p.sellPrice <= 0.2 ? (
                  <p className="text-xs font-black text-amber-600 mt-1.5">🔥 SUPER DEAL: slim {Math.round((margin / p.sellPrice) * 100)}% margin, priced to fly. Volume is the profit.</p>
                ) : null}
                <p className="text-xs font-semibold text-muted-foreground mt-1">Forecast: ~{forecast} sold/day {low && <span className="text-loss font-black">· stock below forecast!</span>}</p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex rounded-full overflow-hidden border-2">
                  {[10, 25, 50, 100].map((n) => (
                    <button key={n} onClick={() => setQty({ ...qty, [p.id]: n })} className={`px-2.5 py-1.5 text-sm font-black ${q === n ? "bg-secondary text-white" : "bg-white text-muted-foreground"}`}>{n}</button>
                  ))}
                </div>
                <Button onClick={() => onPurchase(p.id, q, method)} className="flex-1 rounded-full font-black gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  {method === "sats" ? `${costSats.toLocaleString()} sats` : formatCurrency(costUsd)}
                </Button>
              </div>
              <p className="text-xs font-bold mt-2">
                {bulk > 0
                  ? <span className="text-accent">🏷️ Bulk discount applied: {Math.round(bulk * 100)}% off this order{method === "sats" ? ", plus the 8% Lightning discount" : ""}</span>
                  : <span className="text-muted-foreground">Order 25+ for 5% off, 50+ for 10%, 100+ for 15%</span>}
                {hasUpgrade(gameState, "buyer-bot") && <span className="text-accent block mt-0.5">🦾 Procurement Negotiator: extra 10% off this order, already in the price above</span>}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
