// TokenContext.js
import React, { createContext, useState, useContext } from "react";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const removeToken = () => {
    setToken(null);
  };

  return (
    <TokenContext.Provider value={{ token, setToken, removeToken }}>
      {children}
    </TokenContext.Provider>
  );
};
