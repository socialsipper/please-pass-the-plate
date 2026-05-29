"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function FavoriteButton({ recipeId }: { recipeId: string }) {
  const [userName, setUserName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  async function checkFavorite(name: string) {
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("recipe_id", recipeId)
      .eq("user_name", name)
      .maybeSingle();

    setIsFavorite(!!data);
  }

  useEffect(() => {
    const savedName = localStorage.getItem("favorite_user_name") || "";
    setUserName(savedName);

    if (savedName) {
      checkFavorite(savedName);
    }
  }, [recipeId]);

  async function toggleFavorite() {
    if (!userName.trim()) {
      alert("Please enter your name before favoriting.");
      return;
    }

    setLoading(true);
    localStorage.setItem("favorite_user_name", userName);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("recipe_id", recipeId)
        .eq("user_name", userName);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setIsFavorite(false);
    } else {
      const { error } = await supabase.from("favorites").insert({
        recipe_id: recipeId,
        user_name: userName,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setIsFavorite(true);
    }

    setLoading(false);
  }

  return (
    <div className="mt-4 rounded-2xl bg-pink-50 p-4">
      <label className="block font-semibold text-black">
        Your Name
        <input
          value={userName}
          onChange={(event) => {
            setUserName(event.target.value);
            if (event.target.value.trim()) {
              checkFavorite(event.target.value.trim());
            }
          }}
          placeholder="Enter your name"
          className="mt-2 w-full rounded-xl border p-3 text-black"
        />
      </label>

      <button
        onClick={toggleFavorite}
        disabled={loading}
        className="mt-3 rounded-xl bg-pink-700 px-5 py-3 text-white hover:bg-pink-800"
      >
        {loading
          ? "Saving..."
          : isFavorite
          ? "❤️ Favorited"
          : "♡ Add to Favorites"}
      </button>
    </div>
  );
}