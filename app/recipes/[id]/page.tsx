import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DeleteButton from "./DeleteButton";
import Comments from "./Comments";
import FavoriteButton from "./FavoriteButton";
import RatingForm from "./RatingForm";
import PrintButton from "./PrintButton";

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

  if (!recipe) return <div>Recipe not found.</div>;

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#656E77]">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        {recipe.main_photo_url && (
          <img
            src={recipe.main_photo_url}
            alt={recipe.title}
            className="mb-8 h-96 w-full rounded-[1.5rem] object-cover"
          />
        )}

        <h1 className="text-4xl font-extrabold text-[#3B5BA5]">
          {recipe.title}
        </h1>

        <Link
          href={`/contributors/${encodeURIComponent(
            recipe.contributor_name || "Unknown"
          )}`}
          className="mt-2 inline-block text-lg font-semibold text-[#E87A5D] hover:underline"
        >
          By {recipe.contributor_name || "Family"}
        </Link>

        <div className="mt-5 flex flex-wrap gap-2 print:hidden">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-white"
            style={{ backgroundColor: "#E87A5D" }}
          >
            Edit Recipe
          </Link>

          <PrintButton />

          <DeleteButton recipeId={recipe.id} />
        </div>

        <FavoriteButton recipeId={recipe.id} />

        <RatingForm recipeId={recipe.id} />

        {recipe.category && (
          <p className="mt-5 inline-block rounded-full bg-slate-100 px-4 py-2 font-semibold text-[#656E77]">
            {recipe.category}
          </p>
        )}

        <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5 md:grid-cols-3">
          <div>
            <p className="font-bold text-[#3B5BA5]">Prep Time</p>
            <p>{recipe.prep_time || "—"}</p>
          </div>

          <div>
            <p className="font-bold text-[#3B5BA5]">Cook Time</p>
            <p>{recipe.cook_time || "—"}</p>
          </div>

          <div>
            <p className="font-bold text-[#3B5BA5]">Servings</p>
            <p>{recipe.servings || "—"}</p>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[#3B5BA5]">
            Ingredients
          </h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed">
            {recipe.ingredients}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[#3B5BA5]">
            Instructions
          </h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed">
            {recipe.instructions}
          </p>
        </section>

        {recipe.notes && (
          <section className="mt-8 rounded-[1.5rem] bg-slate-50 p-5">
            <h2 className="text-2xl font-bold text-[#3B5BA5]">
              Family Notes
            </h2>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed">
              {recipe.notes}
            </p>
          </section>
        )}

        <div className="print:hidden">
          <Comments recipeId={recipe.id} />
        </div>
      </div>
    </main>
  );
}