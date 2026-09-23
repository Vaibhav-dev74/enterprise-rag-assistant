import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {

      setUser(JSON.parse(savedUser));

    }

    setLoading(false);

  }, []);

  const login = (token, userData) => {

    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

  };

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {

  return useContext(AuthContext);

}