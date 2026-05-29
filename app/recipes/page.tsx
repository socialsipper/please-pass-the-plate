import Link from "next/link";
import { supabase } from "@/lib/supabase";

const categories = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Appetizers",
  "Side Dishes",
  "Soups",
  "Salads",
  "Desserts",
  "Drinks",
  "Holiday Recipes",
  "Family Classics",
  "Slow Cooker",
  "Grilling",
  "Healthy Options",
];

function getAverageRating(ratings: { rating: number }[] | null) {
  if (!ratings || ratings.length === 0) return null;

  const total = ratings.reduce((sum, item) => sum + item.rating, 0);
  return total / ratings.length;
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category || "All";

  let query = supabase
    .from("recipes")
    .select("*, ratings(rating)")
    .order("created_at", { ascending: false });

  if (selectedCategory !== "All") {
    query = query.eq("category", selectedCategory);
  }

  const { data: recipes } = await query;

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#656E77]">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-4xl font-extrabold text-[#3B5BA5]">
          Recipe Library
        </h1>

        <form className="mb-6" action="/recipes/search">
          <input
            name="q"
            placeholder="Search recipes, ingredients, or contributors..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-[#656E77] outline-none focus:border-[#3B5BA5]"
          />

          <button
            className="mt-3 rounded-full px-6 py-3 font-bold text-white shadow-sm"
            style={{ backgroundColor: "#E87A5D" }}
          >
            Search
          </button>
        </form>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={
                category === "All"
                  ? "/recipes"
                  : `/recipes?category=${encodeURIComponent(category)}`
              }
              className={`rounded-full px-4 py-2 text-sm font-bold shadow-sm ${
                selectedCategory === category
                  ? "text-white"
                  : "border border-slate-200 bg-white text-[#656E77] hover:bg-slate-50"
              }`}
              style={
                selectedCategory === category
                  ? { backgroundColor: "#E87A5D" }
                  : undefined
              }
            >
              {category}
            </Link>
          ))}
        </div>

        {recipes && recipes.length === 0 && (
          <p className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            No recipes found in this category.
          </p>
        )}

        <div className="space-y-5">
          {recipes?.map((recipe) => {
            const averageRating = getAverageRating(recipe.ratings);

            return (
              <Link
                href={`/recipes/${recipe.id}`}
                key={recipe.id}
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

                  <p className="mt-1 text-[#656E77]">
                    By {recipe.contributor_name || "Family"}
                  </p>

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