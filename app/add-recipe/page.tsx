"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

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

export default function AddRecipePage() {
  const [saving, setSaving] = useState(false);

  async function saveRecipe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const form = new FormData(event.currentTarget);
    const photo = form.get("photo") as File;

    let mainPhotoUrl = "";

    if (photo && photo.size > 0) {
      const safeName = photo.name.toLowerCase().replace(/[^a-z0-9.]/g, "-");
      const fileName = `${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("recipe-photos")
        .upload(fileName, photo);

      if (uploadError) {
        alert(uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("recipe-photos")
        .getPublicUrl(fileName);

      mainPhotoUrl = data.publicUrl;
    }

    const { error } = await supabase.from("recipes").insert({
      title: form.get("title"),
      contributor_name: form.get("contributor_name"),
      category: form.get("category"),
      prep_time: form.get("prep_time"),
      cook_time: form.get("cook_time"),
      servings: form.get("servings"),
      notes: form.get("notes"),
      ingredients: form.get("ingredients"),
      instructions: form.get("instructions"),
      main_photo_url: mainPhotoUrl,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/recipes";
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#656E77]">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-4xl font-extrabold text-[#3B5BA5]">
          Add a Recipe
        </h1>

        <p className="mt-3 text-[#656E77]">
          Save a family recipe with ingredients, instructions, notes, and an optional photo.
        </p>

        <form onSubmit={saveRecipe} className="mt-8 space-y-5">
          <label className="block font-semibold text-[#3B5BA5]">
            Recipe Title
            <input
              name="title"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <label className="block font-semibold text-[#3B5BA5]">
            Contributor
            <input
              name="contributor_name"
              className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <label className="block font-semibold text-[#3B5BA5]">
            Category
            <select
              name="category"
              defaultValue="Family Classics"
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
                placeholder="10 min"
                className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
              />
            </label>

            <label className="block font-semibold text-[#3B5BA5]">
              Cook Time
              <input
                name="cook_time"
                placeholder="35 min"
                className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
              />
            </label>

            <label className="block font-semibold text-[#3B5BA5]">
              Servings
              <input
                name="servings"
                placeholder="4"
                className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
              />
            </label>
          </div>

          <label className="block font-semibold text-[#3B5BA5]">
            Photo
            <input
              name="photo"
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black"
            />
          </label>

          <label className="block font-semibold text-[#3B5BA5]">
            Ingredients
            <textarea
              name="ingredients"
              required
              className="mt-2 h-32 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <label className="block font-semibold text-[#3B5BA5]">
            Instructions
            <textarea
              name="instructions"
              required
              className="mt-2 h-40 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <label className="block font-semibold text-[#3B5BA5]">
            Family Notes
            <textarea
              name="notes"
              placeholder="Tips, memories, substitutions..."
              className="mt-2 h-28 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-white"
            style={{ backgroundColor: "#E87A5D" }}
          >
            {saving ? "Saving..." : "Save Recipe"}
          </button>
        </form>
      </div>
    </main>
  );
}