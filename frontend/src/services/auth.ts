// src/services/auth.ts

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data; // e.g., token, user info, etc.
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
