import InstrumentCard from "../card/InstrumentCard";
import type { InstrumentsListProps } from "@/utils/types";

function InstrumentsList({ instruments, children }: InstrumentsListProps) {
  return (
    <section className="mt-4 gap-8 grid sm:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4">
      {instruments.map((instrument) => {
        return (
          <div>
            {children}
            <InstrumentCard key={instrument.id} instrument={instrument} />
          </div>
        );
      })}
    </section>
  );
}

export default InstrumentsList;
