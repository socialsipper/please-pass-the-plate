"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function FavoritesPage() {
  const [userName, setUserName] = useState("");
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  async function loadFavorites(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { data, error } = await supabase
      .from("favorites")
      .select("recipes(*)")
      .eq("user_name", userName);

    if (error) {
      alert(error.message);
      return;
    }

    setFavorites(data || []);
    setSearched(true);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#656E77]">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-4xl font-extrabold text-[#3B5BA5]">
          My Favorite Recipes
        </h1>

        <form
          onSubmit={loadFavorites}
          className="mb-8 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
        >
          <label className="block font-semibold text-[#3B5BA5]">
            Enter your name
            <input
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              required
              placeholder="Example: Shannon"
              className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-black outline-none focus:border-[#3B5BA5]"
            />
          </label>

          <button
            className="mt-4 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-white"
            style={{ backgroundColor: "#E87A5D" }}
          >
            Show My Favorites
          </button>
        </form>

        {searched && favorites.length === 0 && (
          <p className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            No favorites found for this name yet.
          </p>
        )}

        <div className="space-y-5">
          {favorites.map((favorite) => {
            const recipe = favorite.recipes;

            if (!recipe) return null;

            return (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="block overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md"
              >
                {recipe.main_photo_url && (
                  <img
                    src={recipe.main_photo_url}
                    alt={recipe.title}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#3B5BA5]">
                    ♡ {recipe.title}
                  </h2>

                  <p className="mt-2 text-[#656E77]">
                    {recipe.category}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}