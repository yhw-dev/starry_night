'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
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

// 로그인 함수 + 이메일 인증 확인
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await user.reload(); // 최신 인증 상태 확인
    if (!user.emailVerified) {
      await signOut(auth); // 인증 안 된 사용자는 바로 로그아웃
      throw new Error("EMAIL_NOT_VERIFIED");
    }

    setUser(user); // 상태 설정 (필요한 경우)
    return userCredential;
  } catch (err) {
    throw err;
  }
};

// 회원가입 함수 (이름 + 이메일 인증)
const register = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 이름 설정
  if (name) {
    await updateProfile(user, { displayName: name });
  }

  // 이메일 인증 전송
  await sendEmailVerification(user);

  // Firestore에 사용자 정보 저장
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    displayName: name ?? null,
    email: user.email,
    emailVerified: false,
    createdAt: serverTimestamp(),
  });

  setUser(user); // 상태 설정 (필요한 경우)
  return userCredential;
};


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
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
        })
      }

  setUser(user); // 사용자 상태 설정
  return result; // 로그인 결과 반환
} catch (error) {
  console.error("Google 로그인 실패:", error);
  throw error;
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
