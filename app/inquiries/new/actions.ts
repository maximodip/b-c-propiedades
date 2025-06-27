"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createInquiry(formData: FormData) {
  const supabase = await createClient();

  // Get property ID from form data
  const propertyId = formData.get("propertyId") as string;

  // Get form data
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!name || !email || !message || !propertyId) {
    return redirect("/inquiries/new?property=" + propertyId);
  }

  // Create the inquiry
  const { error: insertError } = await supabase
    .from("property_inquiries")
    .insert({
      property_id: propertyId,
      name,
      email,
      phone: phone || null,
      message,
      read: false,
    });

  if (insertError) {
    console.error("Error creating inquiry:", insertError);
    return redirect("/inquiries/new?property=" + propertyId);
  }

  // Redirect to success page
  redirect("/inquiries/success");
}
