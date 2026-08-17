import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectDB();

    const blogs = await Blog.find()
      .sort({ title: 1 })
      .lean();

    return NextResponse.json({
      blogs,
    });
  } catch (error) {
    console.error("GET categories error:", error);

    return NextResponse.json(
      { message: "ไม่สามารถโหลดได้ T_T" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const slug = String(body.slug ?? "")
      .trim()
      .toLowerCase();
    const content = String(body.content ?? "").trim();

    if (!title || !slug) {
      return NextResponse.json(
        { message: "กรุณากรอกชื่อและ slug" },
        { status: 400 }
      );
    }

    const existingCategory = await Blog.findOne({
      $or: [{ title }, { slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "ชื่อหรือ slug นี้มีอยู่แล้ว" },
        { status: 409 }
      );
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
    });

    return NextResponse.json(
      {
        message: "เพิ่มหมวดหมู่สำเร็จ",
        blog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST category error:", error);

    return NextResponse.json(
      { message: "ไม่สามารถเพิ่มหมวดหมู่ได้" },
      { status: 500 }
    );
  }
}