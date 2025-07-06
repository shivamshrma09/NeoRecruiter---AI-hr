import React, { createContext } from "react";

// SendDataContext banayein
export const SendDataContext = createContext();

// Provider component
export function SendDataProvider({ children }) {
  // Universal data bhejne wala function
  const sendData = async ({ url, method = "POST", data = {}, headers = {}, withCredentials = false }) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        credentials: withCredentials ? "include" : "same-origin",
        body: JSON.stringify(data),
      });
      // Agar aapko response chahiye toh yeh return karen, warna hata dein
      return await response.json();
    } catch (err) {
      console.error("SendData Error:", err);
      throw err;
    }
  };

  return (
    <SendDataContext.Provider value={{ sendData }}>
      {children}
    </SendDataContext.Provider>
  );
}
