import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GameState } from "@/types/game";
import { formatCurrency, formatSats, netWorth, MOGUL_NET_WORTH } from "@/lib/gameLogic";
import { Wallet, Zap, Crown, Heart, CalendarDays } from "lucide-react";

interface Props {
  gameState: GameState;
  dailyProfit: number;
}

export const FinancialDashboard = ({ gameState, dailyProfit }: Props) => {
  const worth = netWorth(gameState);
  const pct = Math.min(100, Math.max(0, (worth / MOGUL_NET_WORTH) * 100));
  const stats = [
    { label: "Cash", value: formatCurrency(gameState.cash), icon: Wallet, cls: gameState.cash < 0 ? "text-loss" : "text-foreground", bg: "bg-pink-100" },
    { label: "Sats Wallet", value: formatSats(gameState.sats), icon: Zap, cls: "text-amber-500", bg: "bg-amber-100" },
    { label: "Reputation", value: `${Math.round(gameState.reputation)} / 100`, icon: Heart, cls: "text-rose-500", bg: "bg-rose-100" },
    { label: "Day", value: `${gameState.day}`, icon: CalendarDays, cls: "text-foreground", bg: "bg-sky-100" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st) => (
          <Card key={st.label} className="bubbly-card p-5 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{st.label}</p>
                <p className={`text-2xl font-black ${st.cls}`}>{st.value}</p>
              </div>
              <div className={`p-3 rounded-full ${st.bg}`}>
                <st.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="bubbly-card p-5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 text-white border-none">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 animate-floaty" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">Road to Gum Mogul</p>
              <p className="text-2xl font-black">Net worth {formatCurrency(worth)} <span className="text-white/70 text-base font-bold">of {formatCurrency(MOGUL_NET_WORTH)}</span></p>
            </div>
          </div>
          <p className="text-sm font-bold bg-white/25 rounded-full px-3 py-1">
            Forecast profit today: {formatCurrency(dailyProfit)} · Total revenue {formatCurrency(gameState.totalRevenue)}
          </p>
        </div>
        <Progress value={pct} className="mt-3 h-4 bg-white/30 [&>div]:bg-white" />
      </Card>
    </div>
  );
};
