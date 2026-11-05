import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GameState } from "@/types/game";
import { formatCurrency, MACHINE_COST, MAX_MACHINES_PER_LOCATION, dailyRent, totalMachines } from "@/lib/gameLogic";
import { Lock, Plus, Sparkles, Megaphone } from "lucide-react";

interface Props {
  gameState: GameState;
  onBuyMachine: (locationId: string) => void;
  onUnlockLocation: (locationId: string) => void;
  onBuyUpgrade: (upgradeId: string) => void;
  onMarketingChange: (spend: number) => void;
}

export const EmpirePanel = ({ gameState, onBuyMachine, onUnlockLocation, onBuyUpgrade, onMarketingChange }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black mb-1">🏰 Your Empire</h2>
        <p className="text-sm font-semibold text-muted-foreground">{totalMachines(gameState)} machines · rent {formatCurrency(dailyRent(gameState))}/day · more traffic means more chewers per machine</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {gameState.locations.map((loc) => (
            <Card key={loc.id} className={`bubbly-card p-5 ${loc.unlocked ? "" : "border-dashed bg-muted/50 opacity-80"}`}>
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-floaty">{loc.emoji}</div>
                <div>
                  <h3 className="font-black text-lg leading-tight">{loc.name}</h3>
                  <p className="text-xs font-bold text-muted-foreground">{loc.blurb}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mt-4 text-sm">
                <div className="bg-muted rounded-2xl py-2"><p className="font-black">{loc.machines}/{MAX_MACHINES_PER_LOCATION}</p><p className="text-[11px] font-bold text-muted-foreground uppercase">machines</p></div>
                <div className="bg-muted rounded-2xl py-2"><p className="font-black">x{loc.traffic.toFixed(1)}</p><p className="text-[11px] font-bold text-muted-foreground uppercase">traffic</p></div>
                <div className="bg-muted rounded-2xl py-2"><p className="font-black">${loc.rentPerMachine}</p><p className="text-[11px] font-bold text-muted-foreground uppercase">rent/day</p></div>
              </div>
              {loc.unlocked ? (
                <Button onClick={() => onBuyMachine(loc.id)} disabled={gameState.cash < MACHINE_COST || loc.machines >= MAX_MACHINES_PER_LOCATION} className="w-full rounded-full font-black mt-4 gap-1">
                  <Plus className="h-4 w-4" /> {loc.machines >= MAX_MACHINES_PER_LOCATION ? "Location full" : `Add machine (${formatCurrency(MACHINE_COST)})`}
                </Button>
              ) : (
                <Button onClick={() => onUnlockLocation(loc.id)} variant="secondary" className="w-full rounded-full font-black mt-4 gap-1">
                  <Lock className="h-4 w-4" /> Open for {formatCurrency(loc.unlockCost)} + first machine {formatCurrency(MACHINE_COST)}
                </Button>
              )}
            </Card>
          ))}

          <Card className="bubbly-card p-5 bg-gradient-to-br from-violet-100 to-fuchsia-100">
            <h3 className="font-black text-lg flex items-center gap-2"><Megaphone className="h-5 w-5 text-fuchsia-600" /> Marketing</h3>
            <p className="text-xs font-bold text-muted-foreground mt-1">Daily spend. Every $1/day adds about +1.8% demand. Diminishing vibes after $25, so the slider stops there.</p>
            <p className="text-3xl font-black mt-3">{formatCurrency(gameState.marketingSpend)}<span className="text-base text-muted-foreground">/day</span></p>
            <Slider value={[gameState.marketingSpend]} min={0} max={25} step={1} onValueChange={([v]) => onMarketingChange(v)} className="mt-3" />
            <p className="text-xs font-black text-fuchsia-700 mt-2">Demand boost right now: +{Math.round(gameState.marketingSpend * 1.8)}%</p>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-black mb-4 flex items-center gap-2"><Sparkles className="h-7 w-7 text-amber-500" /> Upgrades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {gameState.upgrades.map((up) => (
            <Card key={up.id} className={`bubbly-card p-5 ${up.owned ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300" : ""}`}>
              <div className="text-4xl">{up.emoji}</div>
              <h3 className="font-black mt-2">{up.name}</h3>
              <p className="text-xs font-semibold text-muted-foreground mt-1 min-h-16">{up.blurb}</p>
              {up.owned ? (
                <p className="font-black text-accent mt-3">✅ Installed</p>
              ) : (
                <Button onClick={() => onBuyUpgrade(up.id)} disabled={gameState.cash < up.cost} className="w-full rounded-full font-black mt-3">
                  Buy {formatCurrency(up.cost)}
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
