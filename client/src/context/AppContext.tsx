import { createContext, useContext, useState, useEffect } from "react";
import {
  initialState,
  type ActivityEntry,
  type Credentials,
  type FoodEntry,
  type User,
} from "../types";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";

const AppContext = createContext(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>(null);
  const [isUserFetched, setIsUserFetched] = useState(
    localStorage.getItem("token") ? false : true,
  );
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  const getStrapiErrorMessage = (error: any): string => {
    const data = error?.response?.data;
    return (
      data?.error?.message ??
      data?.message ??
      error?.message ??
      "Request failed"
    );
  };

 const signup = async (credentials: Credentials) => {
  try {
    const { data } = await api.post("/api/auth/local/register", {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    });

    setUser({ ...data.user, token: data.jwt });

    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }

    localStorage.setItem("token", data.jwt);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
  } catch (error: any) {
    console.log(error.response?.data); // show real error in console
    toast.error(getStrapiErrorMessage(error));
  }
};

  const login = async (credentials: Credentials) => {
  try {
    const { data } = await api.post("/api/auth/local", {
      identifier: credentials.email,
      password: credentials.password,
    });

    setUser({ ...data.user, token: data.jwt });

    localStorage.setItem("token", data.jwt);

    api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
  } catch (error: any) {
    console.log(error.response?.data);
    toast.error(getStrapiErrorMessage(error));
  }
};
  const fetchUser = async (token: string) => {
    try {
      const { data } = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...data, token });
      if (data?.age && data?.weight && data?.goal) {
        setOnboardingCompleted(true);
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error: any) {
      toast.error(getStrapiErrorMessage(error));
    }
    setIsUserFetched(true);
  };

  const fetchFoodLogs = async (token: string) => {
    try {
      const { data } = await api.get("//api/food-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllFoodLogs(data);
    } catch (error: any) {
      toast.error(getStrapiErrorMessage(error));
    }
  };

  const fetchActivityLogs = async (token: string) => {
    try {
      const { data } = await api.get("/api/activity-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllActivityLogs(data);
    } catch (error: any) {
      toast.error(getStrapiErrorMessage(error));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingCompleted(false);
    api.defaults.headers.common["Authorization"] = "";
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await fetchUser(token);
        await fetchFoodLogs(token);
        await fetchActivityLogs(token);
      })();
    }
  }, []);

  const value = {
    user,
    setUser,
    isUserFetched,
    fetchUser,
    signup,
    login,
    logout,
    onboardingCompleted,
    setOnboardingCompleted,
    allFoodLogs,
    allActivityLogs,
    setAllFoodLogs,
    setAllActivityLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
