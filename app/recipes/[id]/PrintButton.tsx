"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-white"
      style={{ backgroundColor: "#E87A5D" }}
    >
      Print Recipe
    </button>
  );
}