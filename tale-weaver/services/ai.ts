import { Role } from "@/types/role";

export async function generateAIResponse(
  role: Role,
  messages: { role: string; content: string }[]
) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error("AI response failed");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}
