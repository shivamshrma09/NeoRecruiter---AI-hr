import React, { createContext, useState, useEffect } from 'react'

export const UserDataContext = createContext()

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
  }

  return (
    <UserDataContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContext
