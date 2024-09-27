import StatsCards from "@/components/admin/StatsCard";
import { fetchReservationsStats } from "@/utils/actions";
import { formatCurrency } from "@/utils/format";
async function Stats() {
  const stats = await fetchReservationsStats();

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-4 lg:grid-cols-3">
      <StatsCards title="instruments" value={stats.instruments} />
      <StatsCards title="total" value={formatCurrency(stats.amount)} />
    </div>
  );
}
export default Stats;
