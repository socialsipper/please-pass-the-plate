"use client";

import { supabase } from "@/lib/supabase";

export default function DeleteButton({ recipeId }: { recipeId: string }) {
  async function deleteRecipe() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe? This cannot be undone."
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/recipes";
  }

  return (
    <button
      onClick={deleteRecipe}
      className="inline-flex h-10 items-center justify-center rounded-lg bg-red-700 px-4 text-sm font-medium text-white hover:bg-red-800"
    >
      Delete Recipe
    </button>
  );
}