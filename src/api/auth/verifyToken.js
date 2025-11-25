export default async function verifyToken() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        error: "No token found in local storage"
      };
    }

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/verify-token`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });


    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Login failed'
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;

  } catch (error) {
    console.error("Frontend verifyToken error:", error);
    return {
      success: false,
      error: "Something went wrong"
    };
  }
}

