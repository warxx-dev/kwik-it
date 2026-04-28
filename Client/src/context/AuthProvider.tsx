import { useContext, useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./authContext";
import { AlertContext } from "./alertContext";
const apiUrl = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/auth/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        showAlert({
          type: "error",
          title: "Login Failed",
          message: error.message || "Invalid credentials",
        });
        setLoading(false);
        return false;
      }

      const userResponse = await fetch(`${apiUrl}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      const userData = await userResponse.json();
      setUser(userData);
      showAlert({
        type: "success",
        title: "Welcome back!",
        message: "You have successfully logged in.",
      });
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      showAlert({
        type: "error",
        title: "Connection Error",
        message: "Could not connect to the server",
      });
      return false;
    }
  };

  const signin = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        showAlert({
          type: "error",
          title: "Registration Failed",
          message: error.message || "Could not create account",
        });
        setLoading(false);
        return false;
      }

      const data = await response.json();
      setUser(data.user);
      showAlert({
        type: "success",
        title: "Account Created!",
        message: "Your account has been successfully created.",
      });
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      showAlert({
        type: "error",
        title: "Connection Error",
        message: "Could not connect to the server",
      });
      return false;
    }
  };

  const googleLogin = async (googleToken: string | undefined) => {
    try {
      setLoading(true);
      if (!googleToken) {
        showAlert({
          type: "error",
          title: "Google Login Error",
          message: "Google authentication token is missing",
        });
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: googleToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        showAlert({
          type: "error",
          title: "Google Login Failed",
          message: error.message || "Could not authenticate with Google",
        });
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser(data.user);
      showAlert({
        type: "success",
        title: "Welcome!",
        message: "Successfully logged in with Google.",
      });
      setLoading(false);
    } catch {
      showAlert({
        type: "error",
        title: "Connection Error",
        message: "Could not connect to the server",
      });
      setLoading(false);
    }
  };

  const logout = () => {
    fetch(`${apiUrl}/auth/logout`, {
      method: "GET",
      credentials: "include",
    }).then(() => {
      console.log("Logged out from backend");
    });

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signin, googleLogin, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
