"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function RatingForm({ recipeId }: { recipeId: string }) {
  const [userName, setUserName] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [saving, setSaving] = useState(false);

  async function loadRatings() {
    const { data } = await supabase
      .from("ratings")
      .select("rating")
      .eq("recipe_id", recipeId);

    if (!data || data.length === 0) {
      setAverageRating(null);
      setRatingCount(0);
      return;
    }

    const total = data.reduce((sum, item) => sum + item.rating, 0);
    setAverageRating(total / data.length);
    setRatingCount(data.length);
  }

  useEffect(() => {
    const savedName = localStorage.getItem("rating_user_name") || "";
    setUserName(savedName);
    loadRatings();
  }, [recipeId]);

  async function saveRating(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    localStorage.setItem("rating_user_name", userName);

    const { error } = await supabase.from("ratings").insert({
      recipe_id: recipeId,
      user_name: userName,
      rating: selectedRating,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    await loadRatings();
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 text-[#656E77] shadow-sm">
      <h2 className="text-2xl font-bold text-[#3B5BA5]">Recipe Rating</h2>

      <p className="mt-2">
        {averageRating
          ? `Average rating: ${averageRating.toFixed(1)} / 5 from ${ratingCount} rating${ratingCount !== 1 ? "s" : ""}`
          : "No ratings yet."}
      </p>

      <form onSubmit={saveRating} className="mt-4 space-y-3">
        <input
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
          required
          placeholder="Your name"
          className="w-full rounded-xl border p-3 text-black"
        />

        <select
          value={selectedRating}
          onChange={(event) => setSelectedRating(Number(event.target.value))}
          className="w-full rounded-xl border p-3 text-black"
        >
          <option value={5}>⭐⭐⭐⭐⭐ 5 stars</option>
          <option value={4}>⭐⭐⭐⭐ 4 stars</option>
          <option value={3}>⭐⭐⭐ 3 stars</option>
          <option value={2}>⭐⭐ 2 stars</option>
          <option value={1}>⭐ 1 star</option>
        </select>

        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-white"
          style={{ backgroundColor: "#E87A5D" }}
        >
          {saving ? "Saving..." : "Submit Rating"}
        </button>
      </form>
    </div>
  );
}