async function login(email, password) {
  // Input validation
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    throw new Error("Invalid email address");
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    throw new Error("Password is required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password
      })
    });

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Login failed'
      }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Typically, you'd get a token or user data back
    // You might want to store the token in localStorage or context
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;

  } catch (error) {
    if (error instanceof Error) {
      console.error('Login error:', error.message);
      throw error; // Re-throw to let the caller handle it
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred during login');
    }
  }
}

export default login

// Example usage:
/*
try {
  const userData = await login('user@example.com', 'password123');
  console.log('Login successful:', userData);
} catch (error) {
  console.error('Login failed:', error.message);
}
*/
