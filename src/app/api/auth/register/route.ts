import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Get the signup information sent from the form
    const { name, email, password } = await req.json();

    // Do not create an account when a field is empty
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់" },
        { status: 400 }
      );
    }

    // Check if this email already has an account
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email នេះត្រូវបានប្រើប្រាស់រួចហើយ" },
        { status: 409 }
      );
    }

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user after all checks pass
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "ចុះឈ្មោះបានជោគជ័យ!",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "មានបញ្ហាក្នុងការបង្កើតគណនី សូមព្យាយាមម្តងទៀត" },
      { status: 500 }
    );
  }
}
