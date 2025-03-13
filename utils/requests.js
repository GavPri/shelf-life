// utils/requests.js
import { supabaseClient } from "./supabaseClient";

export const getFoodItems = async ({ userId, token }) => {
  const supabase = await supabaseClient(token);
  const { data: todos, error } = await supabase
    .from("foods")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching todos:", error.message);
    return [];
  }

  return todos;
};

export const postFoodItem = async ({ userId, token, data }) => {
  const supabase = await supabaseClient(token);

  const { data: insertedData, error } = await supabase
    .from("foods")
    .insert([
      {
        user_id: userId,
        name: data.name,
        expiry_date: data.expiry_date.toISOString(), // ✅ Convert to ISO date
        quantity: data.quantity,
        location: data.storage_location || "fridge",
      },
    ])
    .select();

  if (error) {
    console.error("Error posting food item:", error.message);
    return null;
  }

  return insertedData;
};


