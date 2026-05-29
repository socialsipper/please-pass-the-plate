import Link from "next/link";
import { supabase } from "@/lib/supabase";

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Desserts",
  "Family Classics",
  "Holiday Recipes",
];

export default async function Home() {
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-orange-50 p-8 text-black">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-5xl font-bold text-orange-800">
            Please, Pass the Plate
          </h1>

          <p className="mt-4 text-xl text-stone-800">
            Welcome to our family's digital cookbook.
          </p>

          <form className="mt-6" action="/recipes/search">
  <input
    name="q"
    placeholder="Search recipes..."
    className="w-full rounded-xl border p-4 text-black"
  />

  <button className="mt-3 rounded-xl bg-orange-700 px-6 py-3 text-white">
    Search
  </button>
</form>

          <div className="mt-6 flex gap-4">
            <Link
              href="/add-recipe"
              className="rounded-xl bg-orange-700 px-6 py-4 text-white"
            >
              Add Recipe
            </Link>

            <Link
              href="/recipes"
              className="rounded-xl bg-blue-700 px-6 py-4 text-white"
            >
              View Recipes
            </Link>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-stone-900">
            Recently Added
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {recipes?.map((recipe) => (
              <Link
                href={`/recipes/${recipe.id}`}
                key={recipe.id}
                className="rounded-2xl bg-white p-4 shadow hover:bg-orange-50"
              >
                {recipe.main_photo_url && (
                  <img
                    src={recipe.main_photo_url}
                    alt={recipe.title}
                    className="mb-4 h-40 w-full rounded-xl object-cover"
                  />
                )}

                <h3 className="text-xl font-bold text-stone-900">
                  {recipe.title}
                </h3>

                <p className="text-stone-700">
                  {recipe.contributor_name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-stone-900">
            Recipe Categories
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-xl bg-white p-4 text-black shadow"
              >
                {category}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}