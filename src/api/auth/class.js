const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/class`;

// GET all classes
export const getAllClasses = async () => {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  return (data.data.data)
};

// GET class by ID
export const getClassById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

// CREATE class (supports array sections)
export const createClass = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// UPDATE class (also supports updating sections array)
export const updateClass = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// DELETE class
export const deleteClass = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return res.json();
};

