import EmptyList from "@/components/home/EmptyList";
import InstrumentsList from "@/components/home/InstrumentsList";
import { fetchFavorites } from "@/utils/actions";

async function FavoritesPage() {
  const favorites = await fetchFavorites();
  if (favorites.length === 0) return <EmptyList />;
  return (
    <InstrumentsList instruments={favorites}>FavoritesPage</InstrumentsList>
  );
}

export default FavoritesPage;
