import { Card } from "@/components/ui/card";
import { CostBreakdown } from "@/types/game";
import { formatCurrency } from "@/lib/gameLogic";
import { Receipt, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  costs: CostBreakdown;
  title: string;
  lnShare: number;
}

export const CostBreakdownPanel = ({ costs, title, lnShare }: Props) => {
  const items = [
    { label: "Revenue", amount: costs.revenue, positive: true },
    { label: "Gum you sold (cost)", amount: -costs.productCost, positive: false },
    { label: "Rent", amount: -costs.rent, positive: false },
    { label: "Marketing", amount: -costs.marketing, positive: false },
    { label: "Card fees (2.9% on card sales)", amount: -costs.cardFees, positive: false },
    ...(costs.miningFees > 0 ? [{ label: "Mining hosting & power", amount: -costs.miningFees, positive: false }] : []),
    { label: "Depreciation (machine wear)", amount: -costs.depreciation, positive: false },
    { label: "Tax (15% of profit)", amount: -costs.tax, positive: false },
  ];
  return (
    <Card className="bubbly-card p-6">
      <h2 className="text-2xl font-black flex items-center gap-2 mb-1">
        <Receipt className="h-6 w-6 text-primary" /> {title}
      </h2>
      <p className="text-xs font-bold text-muted-foreground mb-4">
        {lnShare > 0
          ? `⚡ ${Math.round(lnShare * 100)}% of sales arrive over Lightning: no card fee, settled instantly into your sats wallet.`
          : "All sales are card sales here, so the 2.9% fee bites every day. A Lightning Terminal fixes that."}
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-dashed">
            <span className="text-sm font-bold text-muted-foreground">{item.label}</span>
            <span className={`text-lg font-black ${item.positive ? "text-profit" : "text-loss"}`}>
              {item.positive ? "+" : ""}{formatCurrency(item.amount)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-3">
          <span className="text-lg font-black flex items-center gap-2">
            {costs.netProfit >= 0 ? <TrendingUp className="h-5 w-5 text-profit" /> : <TrendingDown className="h-5 w-5 text-loss" />} Net profit
          </span>
          <span className={`text-2xl font-black ${costs.netProfit >= 0 ? "text-profit" : "text-loss"}`}>{formatCurrency(costs.netProfit)}</span>
        </div>
      </div>
      <div className="mt-5 p-4 bg-muted rounded-2xl">
        <p className="text-[13px] font-semibold text-muted-foreground leading-relaxed">
          💡 Depreciation lowers your machines' value, not your cash. The cash that actually leaves is rent, marketing, card fees and tax. Stock is paid when you buy it, which is why restocking day feels expensive.
        </p>
      </div>
    </Card>
  );
};
