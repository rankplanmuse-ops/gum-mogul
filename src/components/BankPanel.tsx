import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameState } from "@/types/game";
import { formatCurrency, LOAN_TIERS } from "@/lib/gameLogic";
import { Landmark } from "lucide-react";

interface Props {
  gameState: GameState;
  onTakeLoan: (tierId: string) => void;
  onRepay: (amount: number) => void;
}

export const BankPanel = ({ gameState, onTakeLoan, onRepay }: Props) => {
  const owed = gameState.bankLoan ?? 0;
  const activeTier = LOAN_TIERS.find((t) => t.id === gameState.bankLoanTier);
  return (
    <Card className="bubbly-card p-5 bg-gradient-to-br from-sky-50 to-indigo-50">
      <h3 className="font-black text-lg flex items-center gap-2">
        <Landmark className="h-5 w-5 text-indigo-600" /> Gum Bank
      </h3>
      <p className="text-xs font-bold text-muted-foreground mt-1">
        Borrow anytime for machines, locations or stock. Repaid automatically from 10% of daily revenue, and what you owe counts against your net worth.
      </p>

      {owed > 0 ? (
        <div className="mt-3 bg-white/80 rounded-2xl border-2 p-4">
          <p className="font-black">
            {activeTier ? `${activeTier.emoji} ${activeTier.name}` : "🏦 Loan"}: you owe {formatCurrency(owed)}
          </p>
          <p className="text-xs font-bold text-muted-foreground mt-1">
            The bank skims 10% of revenue every day. Repay early to clear it faster:
          </p>
          <div className="flex gap-2 mt-3">
            <Button onClick={() => onRepay(50)} disabled={gameState.cash <= 0} variant="secondary" className="flex-1 rounded-full font-black">
              Repay $50
            </Button>
            <Button onClick={() => onRepay(owed)} disabled={gameState.cash <= 0} className="flex-1 rounded-full font-black">
              Pay off {formatCurrency(Math.min(owed, Math.max(0, gameState.cash)))}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 mt-3">
          {LOAN_TIERS.map((tier) => {
            const qualifies = gameState.totalRevenue >= tier.requiresRevenue;
            return (
              <div key={tier.id} className="bg-white/80 rounded-2xl border-2 p-3 flex items-center gap-3">
                <div className="text-3xl">{tier.emoji}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-sm">{tier.name}: {formatCurrency(tier.amount)}</p>
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    {tier.blurb} You repay {formatCurrency(tier.amount * (1 + tier.interest))} total.
                  </p>
                </div>
                <Button onClick={() => onTakeLoan(tier.id)} disabled={!qualifies} className="rounded-full font-black shrink-0">
                  {qualifies ? "Borrow" : `Needs $${tier.requiresRevenue.toLocaleString()} revenue`}
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-[11px] font-bold text-muted-foreground mt-3">
        Broke with a Lightning Terminal? The one-time Lightning rescue loan in the wallet above is separate, and faster.
      </p>
    </Card>
  );
};
