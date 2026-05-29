"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Comments({ recipeId }: { recipeId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  async function loadComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setComments(data || []);
  }

  useEffect(() => {
    loadComments();
  }, [recipeId]);

  async function addComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const { error } = await supabase.from("comments").insert({
      recipe_id: recipeId,
      author_name: form.get("author_name"),
      comment: form.get("comment"),
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    formElement.reset();
    await loadComments();
  }

  return (
    <div className="mt-8 rounded-2xl bg-orange-50 p-5">
      <h2 className="text-2xl font-bold text-black">
        Family Comments
      </h2>

      <form onSubmit={addComment} className="mt-4 space-y-3">
        <input
          name="author_name"
          placeholder="Your name"
          className="w-full rounded-xl border p-3 text-black"
        />

        <textarea
          name="comment"
          required
          placeholder="Add a family memory, note, or review..."
          className="h-24 w-full rounded-xl border p-3 text-black"
        />

        <button
          type="submit"
          className="rounded-xl bg-orange-700 px-5 py-3 text-white hover:bg-orange-800"
        >
          {saving ? "Saving..." : "Add Comment"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-600">
            No comments yet. Be the first to share a family memory!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl bg-white p-4 shadow"
            >
              <p className="font-semibold text-black">
                {comment.author_name || "Family Member"}
              </p>

              <p className="mt-2 whitespace-pre-wrap text-black">
                {comment.comment}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}