const API_BASE_URL = "http://127.0.0.1:8000/api";


// ==========================================
// GET STORED ACCESS TOKEN
// ==========================================

const getAccessToken = () => {
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
};


// ==========================================
// COMMON API REQUEST
// ==========================================

const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  // No content response, commonly used for DELETE
  if (response.status === 204) {
    return null;
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      "Something went wrong. Please try again.";

    throw new Error(message);
  }

  return data;
};


// ==========================================
// CUSTOMER API
// ==========================================

export const customerAPI = {

  // GET /api/customers/
  getAll: () => {
    return apiRequest("/customers/");
  },


  // GET /api/customers/:id/
  getById: (id) => {
    return apiRequest(`/customers/${id}/`);
  },


  // POST /api/customers/
  create: (customer) => {
    return apiRequest("/customers/", {
      method: "POST",
      body: JSON.stringify(customer),
    });
  },


  // PATCH /api/customers/:id/
  update: (id, customer) => {
    return apiRequest(`/customers/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(customer),
    });
  },


  // DELETE /api/customers/:id/
  delete: (id) => {
    return apiRequest(`/customers/${id}/`, {
      method: "DELETE",
    });
  },

};

// ==========================================
// FURNITURE API
// ==========================================

export const furnitureAPI = {

  // GET /api/furniture/
  getAll: () => {
    return apiRequest("/furniture/");
  },


  // GET /api/furniture/:id/
  getById: (id) => {
    return apiRequest(`/furniture/${id}/`);
  },


  // POST /api/furniture/
  create: (furniture) => {
    return apiRequest("/furniture/", {
      method: "POST",
      body: JSON.stringify(furniture),
    });
  },


  // PATCH /api/furniture/:id/
  update: (id, furniture) => {
    return apiRequest(`/furniture/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(furniture),
    });
  },


  // DELETE /api/furniture/:id/
  delete: (id) => {
    return apiRequest(`/furniture/${id}/`, {
      method: "DELETE",
    });
  },

};


export default apiRequest;