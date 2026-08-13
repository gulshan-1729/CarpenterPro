import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://127.0.0.1:8000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET STORED AUTH DATA
  // ==========================================

  const getStoredAuth = () => {
    const localToken =
      localStorage.getItem("accessToken");

    const sessionToken =
      sessionStorage.getItem("accessToken");

    const token =
      localToken || sessionToken;

    const storedUser =
      localStorage.getItem("currentUser") ||
      sessionStorage.getItem("currentUser");

    let parsedUser = null;

    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
      } catch {
        parsedUser = null;
      }
    }

    return {
      token,
      user: parsedUser,
    };
  };

  // ==========================================
  // CLEAR AUTHENTICATION
  // ==========================================

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberMe");

    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("currentUser");

    setAccessToken(null);
    setUser(null);
  };

  // ==========================================
  // CHECK CURRENT LOGIN
  // ==========================================

  const checkAuth = async () => {
    const {
      token,
      user: storedUser,
    } = getStoredAuth();

    if (!token) {
      setAccessToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    setAccessToken(token);

    if (storedUser) {
      setUser(storedUser);
    }

    try {
      const response = await fetch(
        `${API_URL}/profile/`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Session expired.");
      }

      const profile = await response.json();

      setUser(profile);

      const isRemembered =
        localStorage.getItem("rememberMe") ===
        "true";

      if (isRemembered) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(profile)
        );
      } else {
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify(profile)
        );
      }

    } catch (error) {
      console.warn(
        "Authentication check failed:",
        error.message
      );

      clearAuth();

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const login = ({
    access,
    refresh,
    user,
    rememberMe = true,
  }) => {
    if (rememberMe) {
      localStorage.setItem(
        "accessToken",
        access
      );

      localStorage.setItem(
        "refreshToken",
        refresh
      );

      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "rememberMe",
        "true"
      );

      sessionStorage.removeItem(
        "accessToken"
      );

      sessionStorage.removeItem(
        "refreshToken"
      );

      sessionStorage.removeItem(
        "currentUser"
      );
    } else {
      sessionStorage.setItem(
        "accessToken",
        access
      );

      sessionStorage.setItem(
        "refreshToken",
        refresh
      );

      sessionStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );

      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "currentUser"
      );

      localStorage.removeItem(
        "rememberMe"
      );
    }

    setAccessToken(access);
    setUser(user);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    clearAuth();
  };

  // ==========================================
  // CHECK LOGIN WHEN APP STARTS
  // ==========================================

  useEffect(() => {
    checkAuth();
  }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    user,
    accessToken,
    loading,
    isAuthenticated: !!accessToken,

    login,
    logout,

    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;