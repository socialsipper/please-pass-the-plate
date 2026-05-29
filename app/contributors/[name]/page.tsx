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
    .select("*")
    .eq("contributor_name", contributorName)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-orange-50 p-8 text-black">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold text-orange-800">
          Recipes by {contributorName}
        </h1>

        <p className="mb-8 text-stone-700">
          {recipes?.length || 0} recipe
          {(recipes?.length || 0) !== 1 ? "s" : ""}
        </p>

        <div className="space-y-4">
          {recipes?.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="block rounded-2xl bg-white p-6 shadow hover:bg-orange-50"
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

              <p className="text-stone-700">
                {recipe.category}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}