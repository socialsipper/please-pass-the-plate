"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AddRecipePage() {
  const [saving, setSaving] = useState(false);

  async function saveRecipe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const form = new FormData(event.currentTarget);
    const photo = form.get("photo") as File;

    let mainPhotoUrl = "";

    if (photo && photo.size > 0) {
      const safeName = photo.name
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "-");

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
    <main className="min-h-screen bg-orange-50 p-8">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg text-black">
        <h1 className="text-4xl font-bold text-orange-800">
          Add a Recipe
        </h1>

        <p className="mt-3 text-stone-700">
          Add a family recipe and optionally upload a photo.
        </p>

        <form onSubmit={saveRecipe} className="mt-8 space-y-4">
          <input
            name="title"
            required
            placeholder="Recipe title"
            className="w-full rounded-xl border p-4 text-black"
          />

          <input
            name="contributor_name"
            placeholder="Contributor name"
            className="w-full rounded-xl border p-4 text-black"
          />

          <select
            name="category"
            defaultValue="Family Classics"
            className="w-full rounded-xl border p-4 text-black"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Appetizers</option>
            <option>Side Dishes</option>
            <option>Soups</option>
            <option>Salads</option>
            <option>Desserts</option>
            <option>Drinks</option>
            <option>Holiday Recipes</option>
            <option>Family Classics</option>
            <option>Slow Cooker</option>
            <option>Grilling</option>
            <option>Healthy Options</option>
          </select>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              name="prep_time"
              placeholder="Prep time, e.g. 10 min"
              className="w-full rounded-xl border p-4 text-black"
            />

            <input
              name="cook_time"
              placeholder="Cook time, e.g. 35 min"
              className="w-full rounded-xl border p-4 text-black"
            />

            <input
              name="servings"
              placeholder="Servings, e.g. 4"
              className="w-full rounded-xl border p-4 text-black"
            />
          </div>

          <input
            name="photo"
            type="file"
            accept="image/*"
            className="w-full rounded-xl border p-4 text-black"
          />

          <textarea
            name="ingredients"
            required
            placeholder="Ingredients"
            className="h-32 w-full rounded-xl border p-4 text-black"
          />

          <textarea
            name="instructions"
            required
            placeholder="Instructions"
            className="h-40 w-full rounded-xl border p-4 text-black"
          />

          <textarea
            name="notes"
            placeholder="Family notes, tips, memories, substitutions..."
            className="h-28 w-full rounded-xl border p-4 text-black"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-700 p-4 text-white"
          >
            {saving ? "Saving..." : "Save Recipe"}
          </button>
        </form>
      </div>
    </main>
  );
}