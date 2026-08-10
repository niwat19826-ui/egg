import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "กรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ" }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error); // <<-- เพิ่มบรรทัดนี้เพื่อแสดง Error ใน Terminal
    return NextResponse.json({ message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์" }, { status: 500 });
  }
}