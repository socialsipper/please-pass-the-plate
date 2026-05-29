import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DeleteButton from "./DeleteButton";
import Comments from "./Comments";
import FavoriteButton from "./FavoriteButton";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (!recipe) {
    return (
      <main className="min-h-screen bg-orange-50 p-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-red-700">
            Recipe not found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 p-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow text-black">
        {recipe.main_photo_url && (
          <img
            src={recipe.main_photo_url}
            alt={recipe.title}
            className="mb-8 h-96 w-full rounded-2xl object-cover"
          />
        )}

        <h1 className="text-4xl font-bold text-orange-800">
          {recipe.title}
        </h1>

        <Link
          href={`/contributors/${encodeURIComponent(
            recipe.contributor_name || "Unknown"
          )}`}
          className="mt-2 inline-block text-lg text-blue-700 hover:underline"
        >
          By {recipe.contributor_name}
        </Link>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="rounded-xl bg-blue-700 px-5 py-3 text-white"
          >
            Edit Recipe
          </Link>

          <DeleteButton recipeId={recipe.id} />
        </div>

        <FavoriteButton recipeId={recipe.id} />

        {recipe.category && (
          <p className="mt-4 text-gray-600">
            Category: {recipe.category}
          </p>
        )}

        <div className="mt-6 grid gap-4 rounded-2xl bg-orange-50 p-4 md:grid-cols-3">
          <div>
            <p className="font-semibold">Prep Time</p>
            <p>{recipe.prep_time || "—"}</p>
          </div>

          <div>
            <p className="font-semibold">Cook Time</p>
            <p>{recipe.cook_time || "—"}</p>
          </div>

          <div>
            <p className="font-semibold">Servings</p>
            <p>{recipe.servings || "—"}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">
            Ingredients
          </h2>

          <p className="mt-2 whitespace-pre-wrap">
            {recipe.ingredients}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold">
            Instructions
          </h2>

          <p className="mt-2 whitespace-pre-wrap">
            {recipe.instructions}
          </p>
        </div>

        {recipe.notes && (
          <div className="mt-8 rounded-2xl bg-yellow-50 p-5">
            <h2 className="text-2xl font-bold">
              Family Notes
            </h2>

            <p className="mt-2 whitespace-pre-wrap">
              {recipe.notes}
            </p>
          </div>
        )}

        <Comments recipeId={recipe.id} />
      </div>
    </main>
  );
}