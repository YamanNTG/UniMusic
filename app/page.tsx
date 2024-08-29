import CategoriesList from "@/components/home/CategoriesList";
import InstrumentsContainer from "@/components/home/InstrumentsContainer";
import LoadingCards from "@/components/card/LoadingCards";
import { Suspense } from "react";

function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  console.log(searchParams);

  return (
    <section>
      <CategoriesList
        category={searchParams.category}
        search={searchParams.search}
      />

      {/* <Suspense fallback={<LoadingCards />}>
        <InstrumentsContainer
          category={searchParams.category}
          search={searchParams.search}
        />
      </Suspense> */}
    </section>
  );
}

export default HomePage;
