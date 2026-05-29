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

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category || "All";

  let query = supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (selectedCategory !== "All") {
    query = query.eq("category", selectedCategory);
  }

  const { data: recipes } = await query;

  return (
    <main className="min-h-screen bg-orange-50 p-8 text-black">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-4xl font-bold text-orange-800">
          Recipe Library
        </h1>

        <form className="mb-6" action="/recipes/search">
          <input
            name="q"
            placeholder="Search recipes, ingredients, or contributors..."
            className="w-full rounded-xl border p-4 text-black"
          />

          <button className="mt-3 rounded-xl bg-orange-700 px-6 py-3 text-white">
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
              className={`rounded-full px-4 py-2 text-sm font-semibold shadow ${
                selectedCategory === category
                  ? "bg-orange-700 text-white"
                  : "bg-white text-stone-800 hover:bg-orange-100"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>

        {recipes && recipes.length === 0 && (
          <p className="rounded-xl bg-white p-6 shadow">
            No recipes found in this category.
          </p>
        )}

        <div className="space-y-4">
          {recipes?.map((recipe) => (
            <Link
              href={`/recipes/${recipe.id}`}
              key={recipe.id}
              className="block rounded-2xl bg-white p-6 text-black shadow hover:bg-orange-50"
            >
              {recipe.main_photo_url && (
                <img
                  src={recipe.main_photo_url}
                  alt={recipe.title}
                  className="mb-4 h-48 w-full rounded-xl object-cover"
                />
              )}

              <h2 className="text-2xl font-bold text-stone-900">
                {recipe.title}
              </h2>

              <p className="text-stone-800">
                {recipe.contributor_name}
              </p>

              <p className="mt-2 text-stone-800">
                Category: {recipe.category}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}