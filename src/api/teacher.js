const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/teacher`;

// GET all teachers
export const getAllTeachers = async () => {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  return data.data
};

// GET teacher by ID
export const getTeacherById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

// CREATE teacher
export const createTeacher = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  if (response.success) {
    console.log(response)
    return response;
  }

  return ""
};

// UPDATE teacher
export const updateTeacher = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// DELETE teacher
export const deleteTeacher = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
