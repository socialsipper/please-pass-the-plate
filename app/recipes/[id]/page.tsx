import { supabase } from "@/lib/supabase";

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
    return <div>Recipe not found.</div>;
  }

  return (
    <main className="min-h-screen bg-orange-50 p-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow text-black">
        <h1 className="text-4xl font-bold text-orange-800">
          {recipe.title}
        </h1>

        <p className="mt-2 text-black">
          By {recipe.contributor_name}
        </p>

        {recipe.main_photo_url && (
          <img
            src={recipe.main_photo_url}
            alt={recipe.title}
            className="mt-6 max-h-96 w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-6 grid gap-4 rounded-2xl bg-orange-50 p-4 md:grid-cols-3">
          <p><strong>Prep:</strong> {recipe.prep_time || "—"}</p>
          <p><strong>Cook:</strong> {recipe.cook_time || "—"}</p>
          <p><strong>Servings:</strong> {recipe.servings || "—"}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-black">Ingredients</h2>
          <p className="mt-2 whitespace-pre-wrap text-black">
            {recipe.ingredients}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-black">Instructions</h2>
          <p className="mt-2 whitespace-pre-wrap text-black">
            {recipe.instructions}
          </p>
        </div>

        {recipe.notes && (
          <div className="mt-8 rounded-2xl bg-yellow-50 p-5">
            <h2 className="text-2xl font-bold text-black">Family Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-black">
              {recipe.notes}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}