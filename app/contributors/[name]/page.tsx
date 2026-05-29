import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ContributorPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const contributorName = decodeURIComponent(name);

  const { data: recipes } = await supabase
    .from("recipes")
    .select("*, ratings(rating)")
    .eq("contributor_name", contributorName)
    .order("created_at", { ascending: false });

  function getAverageRating(ratings: { rating: number }[] | null) {
    if (!ratings || ratings.length === 0) return null;

    const total = ratings.reduce((sum, item) => sum + item.rating, 0);
    return total / ratings.length;
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#656E77]">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-extrabold text-[#3B5BA5]">
          Recipes by {contributorName}
        </h1>

        <p className="mt-2 mb-8 text-lg text-[#656E77]">
          {recipes?.length || 0} recipe
          {(recipes?.length || 0) !== 1 ? "s" : ""}
        </p>

        <div className="space-y-5">
          {recipes?.map((recipe) => {
            const averageRating = getAverageRating(recipe.ratings);

            return (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="block overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {recipe.main_photo_url && (
                  <img
                    src={recipe.main_photo_url}
                    alt={recipe.title}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#3B5BA5]">
                    {recipe.title}
                  </h2>

                  <p className="mt-2 text-[#656E77]">
                    Category: {recipe.category}
                  </p>

                  <p className="mt-3 font-bold text-[#E87A5D]">
                    {averageRating
                      ? `⭐ ${averageRating.toFixed(1)} / 5`
                      : "No ratings yet"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}