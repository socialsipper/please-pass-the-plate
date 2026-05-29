import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ContributorsPage() {
  const { data: recipes } = await supabase
    .from("recipes")
    .select("contributor_name");

  const counts: Record<string, number> = {};

  recipes?.forEach((recipe) => {
    const name = recipe.contributor_name || "Unknown";

    counts[name] = (counts[name] || 0) + 1;
  });

  const contributors = Object.entries(counts).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-[#656E77]">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-4xl font-extrabold text-[#3B5BA5]">
          Contributors
        </h1>

        <p className="mb-8 text-lg text-[#656E77]">
          Browse recipes by contributor.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {contributors.map(([name, count]) => (
            <Link
              key={name}
              href={`/contributors/${encodeURIComponent(name)}`}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-2xl font-bold text-[#3B5BA5]">
                {name}
              </h2>

              <p className="mt-2 text-[#656E77]">
                {count} recipe{count !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}