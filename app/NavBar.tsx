import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="mb-8 rounded-3xl border bg-white p-4 shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group">
          <h1
            className="text-2xl font-bold transition"
            style={{ color: "#3B5BA5" }}
          >
            Please, Pass the Plate
          </h1>
        </Link>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-semibold transition"
            style={{
              backgroundColor: "#F5F7FB",
              color: "#656E77",
            }}
          >
            Home
          </Link>

          <Link
            href="/recipes"
            className="rounded-full px-4 py-2 text-sm font-semibold transition"
            style={{
              backgroundColor: "#F5F7FB",
              color: "#656E77",
            }}
          >
            Recipes
          </Link>

          <Link
            href="/contributors"
            className="rounded-full px-4 py-2 text-sm font-semibold transition"
            style={{
              backgroundColor: "#F5F7FB",
              color: "#656E77",
            }}
          >
            Contributors
          </Link>

          <Link
            href="/favorites"
            className="rounded-full px-4 py-2 text-sm font-semibold transition"
            style={{
              backgroundColor: "#FDF2F2",
              color: "#656E77",
            }}
          >
            Favorites
          </Link>

          <Link
            href="/add-recipe"
            className="rounded-full px-5 py-2 text-sm font-bold text-white shadow"
            style={{
              backgroundColor: "#E87A5D",
            }}
          >
            + Add Recipe
          </Link>
        </div>
      </div>
    </nav>
  );
}
