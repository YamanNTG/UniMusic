import { FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "../form/Buttons";
import { fetchFavoriteId } from "@/utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";

async function FavoriteToggleButton({
  instrumentId,
}: {
  instrumentId: string;
}) {
  const { userId } = auth();
  if (!userId) return <CardSignInButton />;
  const favoriteId = await fetchFavoriteId({ instrumentId });
  return (
    <FavoriteToggleForm favoriteId={favoriteId} instrumentId={instrumentId} />
  );
}

export default FavoriteToggleButton;
