import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@food_app_session';
const USERS_KEY   = '@food_app_users';

export interface AuthUser {
  id: string;
  name: string;
  contact: string;
  contactType: 'email' | 'phone';
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'SET_USER';    payload: AuthUser }
  | { type: 'LOGOUT' }
  | { type: 'DONE_LOADING' };

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, isLoading: false };
    case 'DONE_LOADING':
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  signIn:  (contact: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp:  (name: string, contact: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Lightweight hash — demo only, not cryptographically secure
function simpleHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY)
      .then((raw) => {
        if (raw) dispatch({ type: 'SET_USER', payload: JSON.parse(raw) });
        else      dispatch({ type: 'DONE_LOADING' });
      })
      .catch(() => dispatch({ type: 'DONE_LOADING' }));
  }, []);

  async function signIn(contact: string, password: string) {
    try {
      const raw   = await AsyncStorage.getItem(USERS_KEY);
      const users: StoredUser[] = raw ? JSON.parse(raw) : [];
      const key   = contact.trim().toLowerCase();
      const found = users.find(
        (u) => u.contact.toLowerCase() === key && u.passwordHash === simpleHash(password),
      );
      if (!found) return { ok: false, error: 'Incorrect email / phone or password.' };
      const { passwordHash: _p, ...user } = found;
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Something went wrong. Please try again.' };
    }
  }

  async function signUp(name: string, contact: string, password: string) {
    try {
      const raw   = await AsyncStorage.getItem(USERS_KEY);
      const users: StoredUser[] = raw ? JSON.parse(raw) : [];
      const key   = contact.trim().toLowerCase();
      if (users.some((u) => u.contact.toLowerCase() === key))
        return { ok: false, error: 'An account with this email / phone already exists.' };

      const newUser: StoredUser = {
        id:           `u_${Date.now()}`,
        name:         name.trim(),
        contact:      key,
        contactType:  key.includes('@') ? 'email' : 'phone',
        passwordHash: simpleHash(password),
      };
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      const { passwordHash: _p, ...user } = newUser;
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Something went wrong. Please try again.' };
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem(SESSION_KEY);
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
