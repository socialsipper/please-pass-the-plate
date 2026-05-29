"use client";

import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const categories = [
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

export default function EditRecipePage() {
  const params = useParams();
  const id = params.id as string;

  const [recipe, setRecipe] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadRecipe() {
      const { data } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      setRecipe(data);
    }

    if (id) loadRecipe();
  }, [id]);

  async function updateRecipe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const form = new FormData(event.currentTarget);

    const { error } = await supabase
      .from("recipes")
      .update({
        title: form.get("title"),
        contributor_name: form.get("contributor_name"),
        category: form.get("category"),
        prep_time: form.get("prep_time"),
        cook_time: form.get("cook_time"),
        servings: form.get("servings"),
        ingredients: form.get("ingredients"),
        instructions: form.get("instructions"),
        notes: form.get("notes"),
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = `/recipes/${id}`;
  }

  if (!recipe) {
    return (
      <main className="min-h-screen bg-white px-4 py-8 text-[#656E77]">
        Loading recipe...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#656E77]">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-4xl font-extrabold text-[#3B5BA5]">
          Edit Recipe
        </h1>

        <form onSubmit={updateRecipe} className="mt-8 space-y-5">
          <label className="block font-semibold text-[#3B5BA5]">
            Recipe Title
            <input
              name="title"
              defaultValue={recipe.title || ""}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <label className="block font-semibold text-[#3B5BA5]">
            Contributor
            <input
              name="contributor_name"
              defaultValue={recipe.contributor_name || ""}
              className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <label className="block font-semibold text-[#3B5BA5]">
            Category
            <select
              name="category"
              defaultValue={recipe.category || "Family Classics"}
              className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block font-semibold text-[#3B5BA5]">
              Prep Time
              <input
                name="prep_time"
                defaultValue={recipe.prep_time || ""}
                placeholder="10 min"
                className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
              />
            </label>

            <label className="block font-semibold text-[#3B5BA5]">
              Cook Time
              <input
                name="cook_time"
                defaultValue={recipe.cook_time || ""}
                placeholder="35 min"
                className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
              />
            </label>

            <label className="block font-semibold text-[#3B5BA5]">
              Servings
              <input
                name="servings"
                defaultValue={recipe.servings || ""}
                placeholder="4"
                className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
              />
            </label>
          </div>

          <label className="block font-semibold text-[#3B5BA5]">
            Ingredients
            <textarea
              name="ingredients"
              defaultValue={recipe.ingredients || ""}
              required
              className="mt-2 h-32 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <label className="block font-semibold text-[#3B5BA5]">
            Instructions
            <textarea
              name="instructions"
              defaultValue={recipe.instructions || ""}
              required
              className="mt-2 h-40 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <label className="block font-semibold text-[#3B5BA5]">
            Family Notes
            <textarea
              name="notes"
              defaultValue={recipe.notes || ""}
              placeholder="Tips, memories, substitutions..."
              className="mt-2 h-28 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-white"
            style={{ backgroundColor: "#E87A5D" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}