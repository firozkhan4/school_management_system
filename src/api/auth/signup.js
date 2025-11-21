async function signup(formData) {

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/school`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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

    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    } else if (error instanceof Error) {
      console.error('Signup error:', error.message);
      throw error; // Re-throw to let the caller handle it
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred during signup');
    }
  }
}

export default signup
