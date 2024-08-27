import { fetchInstruments } from "@/utils/actions";
import InstrumentsList from "./InstrumentsList";
import EmptyList from "./EmptyList";
import { type InstrumentCardProps } from "@/utils/types";

async function InstrumentsContainer({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) {
  const instruments: InstrumentCardProps[] = await fetchInstruments({
    category,
    search,
  });

  if (instruments.length === 0) {
    return (
      <EmptyList
        heading="No results."
        message="Try changing or removing some of your filters."
        btnText="Clear Filters"
      />
    );
  }
  return <InstrumentsList instruments={instruments} />;
}

export default InstrumentsContainer;
