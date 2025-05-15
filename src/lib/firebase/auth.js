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

// ✅ 타입 명세 (선택: JS에서는 생략 가능)
const AuthContext = createContext({
  user: null,
  login: async (_email, _password) => {},
  register: async (_email, _password) => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
})

// ✅ AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    setUser(result.user)
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

// ✅ 커스텀 훅: 어디서든 로그인 정보 불러오기 가능
export const useAuth = () => useContext(AuthContext)
