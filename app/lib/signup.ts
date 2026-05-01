"use server";

import { z } from "zod";
import postgres from "postgres";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signupAction(
  prevState: string | undefined,
  formData: FormData,
) {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return parsed.error.errors[0].message;
  }
  const { name, email, password } = parsed.data;
  try {
    const existing = await sql`SELECT * FROM users WHERE email=${email}`;
    if (existing.length > 0) {
      return "Email already in use.";
    }
    const hashed = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashed})`;
    redirect("/login");
  } catch (e) {
    return "Signup failed. Please try again.";
  }
}
