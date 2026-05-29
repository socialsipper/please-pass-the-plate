import Link from "next/link";
import { supabase } from "@/lib/supabase";

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Desserts",
  "Family Classics",
  "Holiday Recipes",
];

function getAverageRating(ratings: { rating: number }[] | null) {
  if (!ratings || ratings.length === 0) return null;

  const total = ratings.reduce((sum, item) => sum + item.rating, 0);
  return total / ratings.length;
}

export default async function Home() {
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*, ratings(rating)")
    .order("created_at", { ascending: false });

  const recentlyAdded = recipes?.slice(0, 3) || [];

  const topRated =
    recipes
      ?.map((recipe) => ({
        ...recipe,
        averageRating: getAverageRating(recipe.ratings),
      }))
      .filter((recipe) => recipe.averageRating !== null)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 3) || [];

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#656E77]">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm md:p-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#E87A5D]">
              Private Family Recipe Hub
            </p>

            <h1 className="text-5xl font-extrabold leading-tight text-[#3B5BA5] md:text-6xl">
              Please, Pass the Plate
            </h1>

            <p className="mt-5 text-xl leading-relaxed text-[#656E77]">
              A clean, private cookbook for saving family favorites, kitchen
              notes, traditions, and recipes worth passing down.
            </p>

            <form className="mt-8" action="/recipes/search">
              <input
                name="q"
                placeholder="Search chicken, cookies, grandma, garlic..."
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-[#656E77] outline-none focus:border-[#3B5BA5]"
              />

              <button
                className="mt-3 rounded-full px-7 py-3 font-bold text-white shadow-sm"
                style={{ backgroundColor: "#E87A5D" }}
              >
                Search Recipes
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/add-recipe"
                className="rounded-full px-6 py-3 font-bold text-white shadow-sm"
                style={{ backgroundColor: "#E87A5D" }}
              >
                + Add Recipe
              </Link>

              <Link
                href="/recipes"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 font-bold text-[#3B5BA5] shadow-sm hover:bg-slate-50"
              >
                Browse All Recipes
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#E87A5D]">
                Fresh from the family kitchen
              </p>

              <h2 className="text-3xl font-bold text-[#3B5BA5]">
                Recently Added
              </h2>
            </div>

            <Link
              href="/recipes"
              className="hidden rounded-full border border-slate-200 bg-white px-5 py-2 font-semibold text-[#3B5BA5] shadow-sm hover:bg-slate-50 md:inline-block"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {recentlyAdded.map((recipe) => {
              const averageRating = getAverageRating(recipe.ratings);

              return (
                <Link
                  href={`/recipes/${recipe.id}`}
                  key={recipe.id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {recipe.main_photo_url ? (
                    <img
                      src={recipe.main_photo_url}
                      alt={recipe.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-slate-100 text-[#656E77]">
                      No photo yet
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-[#3B5BA5]">
                      {recipe.title}
                    </h3>

                    <p className="mt-1 text-[#656E77]">
                      By {recipe.contributor_name || "Family"}
                    </p>

                    <p className="mt-3 font-semibold text-[#E87A5D]">
                      {averageRating
                        ? `⭐ ${averageRating.toFixed(1)} / 5`
                        : "No ratings yet"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-3xl font-bold text-[#3B5BA5]">
            Top Rated Recipes
          </h2>

          {topRated.length === 0 ? (
            <p className="rounded-3xl border border-slate-100 bg-white p-6 text-[#656E77] shadow-sm">
              No rated recipes yet.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {topRated.map((recipe) => (
                <Link
                  href={`/recipes/${recipe.id}`}
                  key={recipe.id}
                  className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {recipe.main_photo_url ? (
                    <img
                      src={recipe.main_photo_url}
                      alt={recipe.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-slate-100 text-[#656E77]">
                      No photo yet
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-[#3B5BA5]">
                      {recipe.title}
                    </h3>

                    <p className="mt-1 text-[#656E77]">
                      By {recipe.contributor_name || "Family"}
                    </p>

                    <p className="mt-3 font-bold text-[#E87A5D]">
                      ⭐ {recipe.averageRating?.toFixed(1)} / 5
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <p className="text-sm font-bold uppercase tracking-wide text-[#E87A5D]">
            Browse by meal
          </p>

          <h2 className="mb-5 text-3xl font-bold text-[#3B5BA5]">
            Recipe Categories
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/recipes?category=${encodeURIComponent(category)}`}
                className="rounded-3xl border border-slate-100 bg-white p-5 font-bold text-[#3B5BA5] shadow-sm hover:bg-slate-50"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}