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
      <main className="min-h-screen bg-orange-50 p-8 text-black">
        Loading recipe...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 p-8 text-black">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
        <h1 className="text-4xl font-bold text-orange-800">
          Edit Recipe
        </h1>

        <form onSubmit={updateRecipe} className="mt-8 space-y-5">
          <label className="block font-semibold">
            Recipe Title
            <input
              name="title"
              defaultValue={recipe.title || ""}
              required
              className="mt-2 w-full rounded-xl border p-4 text-black"
            />
          </label>

          <label className="block font-semibold">
            Contributor
            <input
              name="contributor_name"
              defaultValue={recipe.contributor_name || ""}
              className="mt-2 w-full rounded-xl border p-4 text-black"
            />
          </label>

          <label className="block font-semibold">
            Category
            <select
              name="category"
              defaultValue={recipe.category || "Family Classics"}
              className="mt-2 w-full rounded-xl border p-4 text-black"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block font-semibold">
              Prep Time
              <input
                name="prep_time"
                defaultValue={recipe.prep_time || ""}
                placeholder="10 min"
                className="mt-2 w-full rounded-xl border p-4 text-black"
              />
            </label>

            <label className="block font-semibold">
              Cook Time
              <input
                name="cook_time"
                defaultValue={recipe.cook_time || ""}
                placeholder="35 min"
                className="mt-2 w-full rounded-xl border p-4 text-black"
              />
            </label>

            <label className="block font-semibold">
              Servings
              <input
                name="servings"
                defaultValue={recipe.servings || ""}
                placeholder="4"
                className="mt-2 w-full rounded-xl border p-4 text-black"
              />
            </label>
          </div>

          <label className="block font-semibold">
            Ingredients
            <textarea
              name="ingredients"
              defaultValue={recipe.ingredients || ""}
              required
              className="mt-2 h-32 w-full rounded-xl border p-4 text-black"
            />
          </label>

          <label className="block font-semibold">
            Instructions
            <textarea
              name="instructions"
              defaultValue={recipe.instructions || ""}
              required
              className="mt-2 h-40 w-full rounded-xl border p-4 text-black"
            />
          </label>

          <label className="block font-semibold">
            Family Notes
            <textarea
              name="notes"
              defaultValue={recipe.notes || ""}
              placeholder="Tips, memories, substitutions..."
              className="mt-2 h-28 w-full rounded-xl border p-4 text-black"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-700 p-4 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}