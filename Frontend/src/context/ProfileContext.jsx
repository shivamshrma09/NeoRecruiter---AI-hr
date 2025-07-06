import React, { createContext, useState, useEffect } from "react";

// Context banayein
export const ProfileContext = createContext();

// Provider component
export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/hr/profile", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error("Profile fetch error:", err));
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
