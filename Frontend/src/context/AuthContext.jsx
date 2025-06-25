/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth({ user: null, token }); // user will load on /profile etc
    }
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: "" });
  };
  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
