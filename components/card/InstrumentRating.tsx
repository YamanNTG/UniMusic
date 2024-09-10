import { FaStar } from "react-icons/fa";
import { fetchInstrumentRating } from "@/utils/actions";
async function InstrumentRating({
  instrumentId,
  inPage,
}: {
  instrumentId: string;
  inPage: boolean;
}) {
  const { rating, count } = await fetchInstrumentRating(instrumentId);
  if (count === 0) return null;

  const className = `flex gap-1 items-center ${inPage ? "text-md" : "text-xs"}`;
  const countText = count > 1 ? "reviews" : " review";
  const countValue = `(${count}) ${inPage ? countText : ""}`;

  return (
    <span className={className}>
      <FaStar className="w-3 h-3" />
      {rating} {countValue}
    </span>
  );
}

export default InstrumentRating;
