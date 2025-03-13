import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabaseClient";
import { z } from "zod";

// Define Zod schema for validation
const foodSchema = z.object({
  name: z.string().min(2, "Food name must be at least 2 characters."),
  expiry_date: z.date(), // Ensure expiry_date is a proper Date object
  quantity: z.number().int().positive().default(1),
  location: z.string().default("fridge"),
});

// ✅ **GET request** → Fetch all food items for authenticated user
export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching food items:", error);
    return NextResponse.json(
      { error: "Failed to fetch foods" },
      { status: 500 }
    );
  }

  return NextResponse.json({ foods: data }, { status: 200 });
}

// ✅ **POST request** → Insert new food item into Supabase
export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Authenticate user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Supabase Auth Error:", userError);
      return NextResponse.json(
        { error: "Unauthorized - No user found" },
        { status: 401 }
      );
    }

    console.log("Authenticated user ID:", user.id);

    // Parse request body
    const body = await req.json();
    const parsedData = foodSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          details: parsedData.error.errors,
        },
        { status: 400 }
      );
    }

    // Insert into Supabase with formatted expiry_date
    const { data, error } = await supabase
      .from("foods")
      .insert([
        {
          ...parsedData.data,
          expiry_date: parsedData.data.expiry_date.toISOString(), // ✅ Ensure ISO format
          user_id: user.id, // ✅ Ensure food belongs to the authenticated user
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json(
        {
          error: "Database insert failed",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Food item added successfully",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
