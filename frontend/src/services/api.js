const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

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
// GET STORED REFRESH TOKEN
// ==========================================

const getRefreshToken = () => {
  return (
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refreshToken")
  );
};

// ==========================================
// SAVE NEW ACCESS TOKEN
// ==========================================

const saveAccessToken = (accessToken) => {
  if (localStorage.getItem("rememberMe") === "true") {
    localStorage.setItem("accessToken", accessToken);
  } else {
    sessionStorage.setItem("accessToken", accessToken);
  }
};

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================

let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  // Prevent multiple API requests from
  // refreshing the token simultaneously.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = fetch(
    `${API_BASE_URL}/auth/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Refresh token expired.");
      }

      const data = await response.json();

      if (!data.access) {
        throw new Error("New access token was not returned.");
      }

      saveAccessToken(data.access);

      return data.access;
    })
    .catch(() => {
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

// ==========================================
// CLEAR AUTH DATA
// ==========================================

const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("rememberMe");

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("currentUser");
};

// ==========================================
// COMMON API REQUEST
// ==========================================

const apiRequest = async (
  endpoint,
  options = {},
  isRetry = false
) => {
  let token = getAccessToken();

  const makeRequest = async (accessToken) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  };

  let response = await makeRequest(token);

  // ========================================
  // ACCESS TOKEN EXPIRED
  // ========================================

  if (response.status === 401 && !isRetry) {
    const newAccessToken =
      await refreshAccessToken();

    if (newAccessToken) {
      token = newAccessToken;

      // Retry original request with fresh token
      response = await apiRequest(
        endpoint,
        options,
        true
      );
    } else {
      clearAuthData();

      throw new Error(
        "Your session has expired. Please login again."
      );
    }
  }

  // ========================================
  // NO CONTENT
  // ========================================

  if (response.status === 204) {
    return null;
  }

  // ========================================
  // READ RESPONSE
  // ========================================

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // ========================================
  // HANDLE ERRORS
  // ========================================

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

  getAll: () => {
    return apiRequest("/customers/");
  },

  getById: (id) => {
    return apiRequest(`/customers/${id}/`);
  },

  create: (customer) => {
    return apiRequest("/customers/", {
      method: "POST",
      body: JSON.stringify(customer),
    });
  },

  update: (id, customer) => {
    return apiRequest(`/customers/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(customer),
    });
  },

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

  getAll: () => {
    return apiRequest("/furniture/");
  },

  getById: (id) => {
    return apiRequest(`/furniture/${id}/`);
  },

  create: (furniture) => {
    return apiRequest("/furniture/", {
      method: "POST",
      body: JSON.stringify(furniture),
    });
  },

  update: (id, furniture) => {
    return apiRequest(`/furniture/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(furniture),
    });
  },

  delete: (id) => {
    return apiRequest(`/furniture/${id}/`, {
      method: "DELETE",
    });
  },

};

// ==========================================
// QUOTATION API
// ==========================================

export const quotationAPI = {

  getAll: () => {
    return apiRequest("/quotations/");
  },

  getById: (id) => {
    return apiRequest(`/quotations/${id}/`);
  },

  create: (quotation) => {
    return apiRequest("/quotations/", {
      method: "POST",
      body: JSON.stringify(quotation),
    });
  },

  update: (id, quotation) => {
    return apiRequest(`/quotations/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(quotation),
    });
  },

  delete: (id) => {
    return apiRequest(`/quotations/${id}/`, {
      method: "DELETE",
    });
  },

};

// ==========================================
// COMPANY API
// ==========================================

export const companyAPI = {

  // GET /api/company/
  get: () => {
    return apiRequest("/company/");
  },

  // PATCH /api/company/
  update: (company) => {
    return apiRequest("/company/", {
      method: "PATCH",
      body: JSON.stringify(company),
    });
  },

};

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default apiRequest;