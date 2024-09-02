import { fetchInstrumentReviews } from "@/utils/actions";
import Title from "../instruments/Title";
import ReviewCard from "./ReviewCard";

async function InstrumentReviews({ instrumentId }: { instrumentId: string }) {
  const reviews = await fetchInstrumentReviews(instrumentId);
  if (reviews.length < 1) return null;
  return (
    <div className="mt-8">
      <Title text="Reviews" />
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {reviews.map((review) => {
          const { comment, rating } = review;
          const { firstName, profileImage } = review.profile;
          const reviewInfo = {
            comment,
            rating,
            name: firstName,
            image: profileImage,
          };
          return <ReviewCard key={review.id} reviewInfo={reviewInfo} />;
        })}
      </div>
    </div>
  );
}

export default InstrumentReviews;
