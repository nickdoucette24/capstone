import { useEffect, useState } from "react";

const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  return loggedIn;
};

export default useAuth;
