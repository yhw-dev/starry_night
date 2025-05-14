'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore'

// ✅ AuthContext 생성 (초기값은 빈 함수들)
const AuthContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
})

// ✅ AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    setUser(result.user)
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const userRef = doc(db, 'users', user.uid)
      const snapshot = await getDoc(userRef)

      if (!snapshot.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        })
      }

      setUser(user)
    } catch (error) {
      console.error('Google 로그인 실패:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ✅ 커스텀 훅
export const useAuth = () => useContext(AuthContext)