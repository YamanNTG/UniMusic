import Image from "next/image";
import Link from "next/link";
import InstrumentRating from "./InstrumentRating";
import FavoriteToggleButton from "./FavoriteToggleButton";
import { InstrumentCardProps } from "@/utils/types";
import { formatCurrency } from "@/utils/format";

async function InstrumentCard({
  instrument,
}: {
  instrument: InstrumentCardProps;
}) {
  const { name, image, price, instructorImage } = instrument;
  const { tagline, id: instrumentId } = instrument;
  return (
    <article className="group relative">
      <Link href={`/instruments/${instrumentId}`}>
        <div className="relative h-[300px] mb-2 overflow-hidden rounded-md">
          <Image
            src={image}
            fill
            sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw"
            alt={name}
            className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold mt-1">
            {name.substring(0, 30)}
          </h3>
          <InstrumentRating instrumentId={instrumentId} inPage={false} />
        </div>
        <p className="text-sm mt-1 text-muted-foreground ">
          {tagline.substring(0, 40)}
        </p>
        <div className="mt-1">
          <p className="text-sm mt-1">
            <span className="font-semibold">{formatCurrency(price)}</span>
          </p>
        </div>
      </Link>
      <div className="absolute top-5 right-5 z-5">
        <FavoriteToggleButton instrumentId={instrumentId} />
      </div>

      <div className="absolute top-0 left-0 z-5">
        <img
          src={instructorImage}
          alt={name}
          className="rounded-md w-[100px] h-[100px] object-cover transform hover:scale-110 transition-transform duration-500"
        />
      </div>
    </article>
  );
}

export default InstrumentCard;
