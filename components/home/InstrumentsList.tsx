import InstrumentCard from "../card/InstrumentCard";
import type { InstrumentCardProps } from "@/utils/types";

function InstrumentsList({
  instruments,
}: {
  instruments: InstrumentCardProps[];
}) {
  return (
    <section className="mt-4 gap-8 grid sm:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4">
      {instruments.map((instrument) => {
        return <InstrumentCard key={instrument.id} instrument={instrument} />;
      })}
    </section>
  );
}

export default InstrumentsList;
