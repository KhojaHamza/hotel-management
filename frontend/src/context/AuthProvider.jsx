import { useState } from 'react'
import { AuthContext } from './AuthContext'
import * as authService from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getStoredUser())

  const login = async (email, password) => {
    const loggedUser = await authService.login(email, password)
    setUser(loggedUser)
    return loggedUser
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const hasRole = (roles) => !!user && roles.includes(user.role)

  const value = { user, isAuthenticated: !!user, login, logout, hasRole }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
