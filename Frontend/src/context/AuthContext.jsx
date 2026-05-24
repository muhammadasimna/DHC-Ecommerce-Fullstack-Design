import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const API_URL = 'http://localhost:5251/api'; // ASP.NET Core API default IIS Express/Kestrel port. Let's make sure it handles both or uses relative or standard localhost port. We can make it customizable, but 5000/5244/7244/5144 are typical. Let's check typical launchSettings.json first.

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // We will dynamically discover the port or try default ports if launchSettings.json is not read yet.
  // Actually let's check launchSettings.json to get the exact port!
  const [backendUrl, setBackendUrl] = useState('http://localhost:5251/api'); 

  useEffect(() => {
    // Check if there is a saved token in localStorage and validate/load user
    const loadUser = async () => {
      if (token) {
        try {
          const res = await fetch(`${backendUrl}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            // Token is invalid/expired
            logout();
          }
        } catch (err) {
          console.error('Failed to load user info', err);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token, backendUrl]);

  const login = async (email, password) => {
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (username, email, password) => {
    const res = await fetch(`${backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, backendUrl, setBackendUrl }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
