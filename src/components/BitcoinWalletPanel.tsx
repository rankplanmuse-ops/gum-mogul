import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameState } from "@/types/game";
import {
  formatCurrency, formatSats, BTC_ROUTES, SATS_PER_USD, consolidationFeeSats,
  MINING_EQUIPMENT_COST, MINING_MONTHLY_FEE, MINING_REQUIRES_REVENUE,
} from "@/lib/gameLogic";
import { Bitcoin, ShieldCheck, Layers, Pickaxe } from "lucide-react";

interface Props {
  gameState: GameState;
  onBuyBtc: (routeId: string, usd: number) => void;
  onSweep: (amountSats: number) => void;
  onConsolidate: () => void;
  onBuyMining: () => void;
  onToggleMining: () => void;
}

export const BitcoinWalletPanel = ({ gameState, onBuyBtc, onSweep, onConsolidate, onBuyMining, onToggleMining }: Props) => {
  const [amount, setAmount] = useState("500");
  const usd = Math.max(0, Math.floor(Number(amount) || 0));
  const utxos = gameState.utxos ?? [];
  const onchain = gameState.btcOnchainSats ?? 0;
  const consolidateFee = consolidationFeeSats(gameState);
  const sorted = [...utxos].sort((a, b) => b.sats - a.sats);

  return (
    <Card className="bubbly-card p-5 mt-6 bg-gradient-to-br from-amber-50 to-orange-50">
      <h3 className="font-black text-lg flex items-center gap-2">
        <Bitcoin className="h-5 w-5 text-amber-600" /> Bitcoin Vault: self-custody, on-chain
      </h3>
      <p className="text-xs font-bold text-muted-foreground mt-1">
        Turn fiat profits into bitcoin you actually hold. No exchange account, no custodian: every buy lands in your own wallet as a UTXO, and you manage those UTXOs like a grown-up bitcoiner.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-3 text-center">
        <div className="bg-white/80 rounded-2xl border-2 py-2 px-1"><p className="font-black text-sm sm:text-base">{formatSats(onchain)}</p><p className="text-[10px] font-bold text-muted-foreground uppercase">on-chain balance</p></div>
        <div className="bg-white/80 rounded-2xl border-2 py-2 px-1"><p className="font-black text-sm sm:text-base">{formatCurrency(onchain / SATS_PER_USD)}</p><p className="text-[10px] font-bold text-muted-foreground uppercase">value at game rate</p></div>
        <div className="bg-white/80 rounded-2xl border-2 py-2 px-1"><p className="font-black text-sm sm:text-base">{utxos.length}</p><p className="text-[10px] font-bold text-muted-foreground uppercase">UTXOs</p></div>
        <div className="bg-white/80 rounded-2xl border-2 py-2 px-1"><p className="font-black text-sm sm:text-base">{gameState.btcFeeRate} sats/vB</p><p className="text-[10px] font-bold text-muted-foreground uppercase">mempool fee today</p></div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-black flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-amber-600" /> Buy bitcoin with cash profits</p>
        <div className="flex gap-2 mt-2 flex-wrap items-center">
          <Input type="number" min={10} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-32 rounded-full font-black" aria-label="USD amount to convert" />
          {[100, 500, 1000, 5000].map((v) => (
            <Button key={v} variant="secondary" onClick={() => setAmount(String(v))} className="rounded-full font-black h-9">${v.toLocaleString()}</Button>
          ))}
          <span className="text-xs font-bold text-muted-foreground">Cash available: {formatCurrency(gameState.cash)}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
          {BTC_ROUTES.map((r) => {
            const received = Math.floor(usd * SATS_PER_USD * (1 - r.feePct));
            return (
              <div key={r.id} className="bg-white/80 rounded-2xl border-2 p-3">
                <p className="font-black text-sm">{r.emoji} {r.name} {r.kyc && <span className="text-[10px] bg-rose-100 text-rose-700 rounded-full px-2 py-0.5 align-middle">KYC</span>}</p>
                <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{r.blurb}</p>
                <p className="text-[11px] font-black text-amber-700 mt-1">Fee {(r.feePct * 100).toFixed(1)}% · you receive about {received.toLocaleString()} sats</p>
                <p className="text-[11px] font-semibold text-muted-foreground mt-1">{r.riskNote}</p>
                <Button onClick={() => onBuyBtc(r.id, usd)} disabled={usd < 10 || gameState.cash < usd} className="w-full rounded-full font-black mt-2 h-9">
                  Buy {formatCurrency(usd)} of BTC
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 bg-white/80 rounded-2xl border-2 p-3">
        <p className="text-sm font-black">🔄 Sweep Lightning sats on-chain</p>
        <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">Lightning is for spending; on-chain is for saving. Sweeping costs a 1% swap fee plus the chain fee, and lands as one clean UTXO. Minimum 10,000 sats: tiny UTXOs cost more to spend later than they are worth.</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {[10000, 50000, 250000].map((v) => (
            <Button key={v} variant="secondary" onClick={() => onSweep(v)} disabled={gameState.sats < v} className="rounded-full font-black h-9">Sweep {v.toLocaleString()}</Button>
          ))}
          <Button variant="secondary" onClick={() => onSweep(Math.floor(gameState.sats))} disabled={gameState.sats < 10000} className="rounded-full font-black h-9">Sweep all {formatSats(gameState.sats)}</Button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-black flex items-center gap-1.5"><Layers className="h-4 w-4 text-amber-600" /> Your UTXOs</p>
        <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
          Every receive is a separate coin. Spending later pays a fee per input, so 20 small UTXOs can cost a fortune to move when fees spike. Consolidate them into one while fees are low, and never mix KYC coins with clean ones unless you accept the whole output becoming identity-linked.
        </p>
        {utxos.length === 0 ? (
          <p className="text-xs font-bold text-muted-foreground mt-2">No UTXOs yet. Buy bitcoin above, sweep Lightning sats, or mine some.</p>
        ) : (
          <div className="max-h-44 overflow-y-auto space-y-1 mt-2 pr-1">
            {sorted.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-2 bg-white/70 rounded-xl border px-3 py-1.5 text-xs font-bold">
                <span>{u.source} <span className="text-muted-foreground">· day {u.day}</span> {u.kyc && <span className="text-[10px] bg-rose-100 text-rose-700 rounded-full px-2 py-0.5">KYC-linked</span>}</span>
                <span className="tabular-nums">{u.sats.toLocaleString()} sats</span>
              </div>
            ))}
          </div>
        )}
        <Button onClick={onConsolidate} disabled={utxos.length < 2 || onchain <= consolidateFee} className="w-full rounded-full font-black mt-2">
          🧹 Consolidate {utxos.length} UTXOs into 1 (fee about {consolidateFee.toLocaleString()} sats at {gameState.btcFeeRate} sats/vB)
        </Button>
      </div>

      <div className="mt-4 bg-white/80 rounded-2xl border-2 p-3">
        <p className="text-sm font-black flex items-center gap-1.5"><Pickaxe className="h-4 w-4 text-amber-600" /> Mining as a service</p>
        <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
          No KYC route that PRINTS bitcoin: a hosting company runs your machines. One-off equipment {formatCurrency(MINING_EQUIPMENT_COST)}, then {formatCurrency(MINING_MONTHLY_FEE)}/month in power and hosting, billed daily. Payouts land weekly in your wallet and swing hard with difficulty and uptime: some weeks beat the fees, some weeks the fees win. Needs {formatCurrency(MINING_REQUIRES_REVENUE)} lifetime revenue.
        </p>
        {gameState.miningOwned ? (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <p className="text-xs font-black">{gameState.miningActive ? "⛏️ Mining: ON" : "⏸️ Mining: paused"} · mined all time: {formatSats(gameState.miningTotalMined ?? 0)} · fees paid: {formatCurrency(gameState.miningTotalFees ?? 0)}</p>
            <Button onClick={onToggleMining} variant={gameState.miningActive ? "destructive" : "default"} className="rounded-full font-black h-9">
              {gameState.miningActive ? "Pause mining" : "Resume mining"}
            </Button>
          </div>
        ) : (
          <Button onClick={onBuyMining} disabled={gameState.cash < MINING_EQUIPMENT_COST || gameState.totalRevenue < MINING_REQUIRES_REVENUE} className="rounded-full font-black mt-2">
            Buy equipment {formatCurrency(MINING_EQUIPMENT_COST)}
          </Button>
        )}
      </div>
    </Card>
  );
};
