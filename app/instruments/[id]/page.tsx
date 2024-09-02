import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import InstrumentRating from "@/components/card/InstrumentRating";
import BookingCalendar from "@/components/instruments/BookingCalendar";
import BreadCrumbs from "@/components/instruments/BreadCrumbs";
import Description from "@/components/instruments/Description";
import ImageContainer from "@/components/instruments/ImageContainer";
import ShareButton from "@/components/instruments/ShareButton";
import UserInfo from "@/components/instruments/UserInfo";
import { Separator } from "@/components/ui/separator";
import { fetchInstrumentDetails, findExistingReview } from "@/utils/actions";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import SubmitReview from "@/components/reviews/SubmitReview";
import InstrumentReviews from "@/components/reviews/InstrumentReviews";

async function InstrumentDetailsPage({ params }: { params: { id: string } }) {
  const instrument = await fetchInstrumentDetails(params.id);
  if (!instrument) redirect("/");
  const firstName = instrument.profile.firstName;
  const instructorImage = instrument.instructorImage;
  const { userId } = auth();
  const isNotOwner = instrument.profile.clerkId !== userId;
  const reviewDoesNotExist =
    userId && isNotOwner && !(await findExistingReview(userId, instrument.id));
  return (
    <section>
      <BreadCrumbs name={instrument.name} />
      <header className="flex justify-between items-center mt-4">
        <h1 className="text-4xl font-bold">{instrument.tagline}</h1>
        <div className="flex items-center gap-x-4">
          <ShareButton name={instrument.name} instrumentId={instrument.id} />
          <FavoriteToggleButton instrumentId={instrument.id} />
        </div>
      </header>
      <ImageContainer mainImage={instrument.image} name={instrument.name} />
      <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
        <div className="lg:col-span-8">
          <div className="flex gap-x-4 items-center">
            <h1 className="text-xl font-bold">{instrument.name}</h1>
            <InstrumentRating inPage instrumentId={instrument.id} />
          </div>
          <UserInfo profile={{ firstName, instructorImage }} />
          <Separator className="mt-4 " />
          <Description description={instrument.description} />
        </div>
        <div className="lg:col-span-4 flex flex-col items-center">
          {/* calendar */}
          <BookingCalendar />
        </div>
      </section>
      {reviewDoesNotExist && <SubmitReview instrumentId={instrument.id} />}
      <InstrumentReviews instrumentId={instrument.id} />
    </section>
  );
}

export default InstrumentDetailsPage;
