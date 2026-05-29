import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.toLowerCase().trim() || "";

  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  const filteredRecipes =
    recipes?.filter((recipe) => {
      const searchableText = `
        ${recipe.title || ""}
        ${recipe.contributor_name || ""}
        ${recipe.category || ""}
        ${recipe.ingredients || ""}
        ${recipe.instructions || ""}
      `.toLowerCase();

      return searchableText.includes(q);
    }) || [];

  return (
    <main className="min-h-screen bg-orange-50 p-8 text-black">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-4xl font-bold text-orange-800">
          Search Results
        </h1>

        <p className="mb-6 text-stone-800">
          Search: <strong>{q}</strong>
        </p>

        <Link
          href="/recipes"
          className="mb-6 inline-block rounded-xl bg-orange-700 px-5 py-3 text-white"
        >
          Back to All Recipes
        </Link>

        {filteredRecipes.length === 0 && (
          <p className="rounded-xl bg-white p-6 shadow">
            No recipes found.
          </p>
        )}

        <div className="space-y-4">
          {filteredRecipes.map((recipe) => (
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