"use client";

import { FormEvent, useState } from "react";

export default function BlogForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(""); // ใช้ content
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function createSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9ก-๙-]/g, "");
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(createSlug(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");

      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          content, // 1. แก้เป็น content
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "เพิ่มบทความไม่สำเร็จ");
      }

      setMessage("เพิ่มบทความสำเร็จ");
      setTitle("");
      setSlug("");
      setContent(""); // 2. แก้เป็น setContent
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาด"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-4 rounded-xl border p-6"
    >
      <h1 className="text-2xl font-bold">เพิ่มบทความ</h1>

      <div>
        <label className="mb-1 block font-medium">
          ชื่อบทความ
        </label>

        <input
          type="text"
          value={title} // 3. แก้เป็น title
          onChange={(event) =>
            handleTitleChange(event.target.value) // 3. แก้เป็น handleTitleChange
          }
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label>Slug</label>

        <input
          type="text"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          เนื้อหา
        </label>

        <textarea
          value={content} // 4. แก้เป็น content
          onChange={(event) =>
            setContent(event.target.value) // 4. แก้เป็น setContent
          }
          className="min-h-28 w-full rounded-lg border px-3 py-2"
        />
      </div>

      {message && (
        <p className="rounded-lg bg-gray-100 p-3">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "กำลังบันทึก..." : "เพิ่มบทความ"}
      </button>
    </form>
  );
}