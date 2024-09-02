import EmptyList from "@/components/home/EmptyList";
import {
  deleteReviewAction,
  fetchInstrumentReviewsByUser,
} from "@/utils/actions";
import ReviewCard from "@/components/reviews/ReviewCard";
import Title from "@/components/instruments/Title";
import FormContainer from "@/components/form/FormContainer";
import { IconButton } from "@/components/form/Buttons";

async function ReviewsPage() {
  const reviews = await fetchInstrumentReviewsByUser();
  if (reviews.length < 1) return <EmptyList />;
  return (
    <>
      <Title text="Your Reviews" />
      <section className="grid md:grid-cols-2 gap-8 mt-4 ">
        {reviews.map((review) => {
          const { comment, rating } = review;
          const { name, image } = review.instrument;
          const reviewInfo = {
            comment,
            rating,
            name,
            image,
          };
          return (
            <ReviewCard key={review.id} reviewInfo={reviewInfo}>
              <DeleteReview reviewId={review.id} />
            </ReviewCard>
          );
        })}
      </section>
    </>
  );
}

const DeleteReview = ({ reviewId }: { reviewId: string }) => {
  const deleteReview = deleteReviewAction.bind(null, { reviewId });
  return (
    <FormContainer action={deleteReview}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
};

export default ReviewsPage;
