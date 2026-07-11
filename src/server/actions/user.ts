"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { profileSchema, passwordSchema } from "@/lib/validations/user";

/**
 * Updates the logged-in user's display name.
 */
export async function updateProfile(name: string) {
  try {
    // 1. Authenticate user
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // 2. Validate input
    const result = profileSchema.safeParse({ name });
    if (!result.success) {
      return {
        success: false,
        error: result.error.issues[0]?.message || "Invalid name validation.",
      };
    }

    // 3. Update database
    await prisma.user.update({
      where: { id: userId },
      data: { name: result.data.name },
    });

    // 4. Revalidate cache so sidebar and greetings refresh
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return { success: false, error: "Failed to update profile name." };
  }
}

/**
 * Validates old credentials and updates the recruiter's password.
 */
export async function changePassword(input: unknown) {
  try {
    // 1. Authenticate user
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // 2. Validate inputs using Zod
    const result = passwordSchema.safeParse(input);
    if (!result.success) {
      return {
        success: false,
        error: result.error.issues[0]?.message || "Password fields did not pass validation.",
      };
    }

    const { currentPassword, newPassword } = result.data;

    // 3. Retrieve current password hash from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return { success: false, error: "User not found in system." };
    }

    // 4. Compare current password using bcryptjs
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: "Current password entered is incorrect." };
    }

    // 5. Hash the new password (10 rounds)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 6. Update database record
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in changePassword:", error);
    return { success: false, error: "An unexpected error occurred while changing password." };
  }
}
