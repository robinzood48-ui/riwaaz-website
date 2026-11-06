import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminToken: string | null;
  login: (email: string) => Promise<boolean>;
  adminLogin: (user: User, token: string) => void;
  adminLogout: () => Promise<void>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  switchAccount: (role: 'admin' | 'customer') => void;
  updateUserAddresses: (address: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('riwaaz_admin_token');
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('riwaaz_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Verify stored admin token on boot
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('riwaaz_admin_token');
      if (!token) return;

      try {
        const res = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(prev => prev && prev.role === 'admin' ? prev : {
            id: data.user.sub || 'user-admin-robin',
            name: data.user.name || 'Robin Zood',
            email: data.user.email || 'robinzood48@gmail.com',
            role: 'admin',
            createdAt: new Date().toISOString()
          });
        } else {
          localStorage.removeItem('riwaaz_admin_token');
          setAdminToken(null);
        }
      } catch (e) {
        console.error('Failed to verify admin token', e);
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('riwaaz_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('riwaaz_user');
    }
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const adminLogin = (adminUser: User, token: string) => {
    setUser(adminUser);
    setAdminToken(token);
    localStorage.setItem('riwaaz_user', JSON.stringify(adminUser));
    localStorage.setItem('riwaaz_admin_token', token);
  };

  const adminLogout = async () => {
    try {
      await fetch('/api/auth/admin-logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setAdminToken(null);
    setUser(null);
    localStorage.removeItem('riwaaz_admin_token');
    localStorage.removeItem('riwaaz_user');
  };

  const logout = () => {
    setAdminToken(null);
    setUser(null);
    localStorage.removeItem('riwaaz_admin_token');
    localStorage.removeItem('riwaaz_user');
  };

  const switchAccount = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setUser({
        id: 'user-admin',
        name: 'RIWAAZ Curator',
        email: 'admin@riwaaz.in',
        role: 'admin',
        phone: '+91 98765 43210',
        createdAt: '2026-01-01T00:00:00Z',
      });
    } else {
      setUser({
        id: 'user-customer',
        name: 'Robin Zood',
        email: 'robinzood48@gmail.com',
        role: 'customer',
        phone: '+91 98111 22334',
        addresses: [
          {
            id: 'addr-1',
            fullName: 'Robin Zood',
            phone: '+91 98111 22334',
            address: 'Villa 14, The Palms, Golf Course Road',
            city: 'Gurugram',
            state: 'Haryana',
            pinCode: '122002',
            isDefault: true,
          },
        ],
        createdAt: '2026-01-10T00:00:00Z',
      });
    }
  };

  const updateUserAddresses = async (address: any) => {
    if (!user) return;
    const currentAddresses = user.addresses || [];
    const updatedAddresses = [...currentAddresses, { ...address, id: `addr-${Date.now()}` }];
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });
    } catch (e) {
      console.error('Failed to sync address to backend', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        adminToken,
        login,
        adminLogin,
        adminLogout,
        register,
        logout,
        switchAccount,
        updateUserAddresses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
