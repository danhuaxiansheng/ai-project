import { Role } from "@/types/role";
import { ReviewResult } from "@/types/review";

export async function reviewContent(
  content: string,
  role: Role,
  context: string
): Promise<ReviewResult> {
  try {
    const response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        role,
        context,
      }),
    });

    if (!response.ok) {
      throw new Error("Review request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Review service error:", error);
    throw error;
  }
}
