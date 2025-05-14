"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
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
} from 'firebase/firestore';

// AuthContext 컨텍스트 생성
const AuthContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {}
});

// AuthProvider 컴포넌트 정의
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 사용자 상태 업데이트
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

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

    return userCredential;
  };

  // 로그아웃 함수
  const logout = async () => {
    await signOut(auth);
  };

  // Google 로그인 + Firestore 유저 정보 저장
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
        });
      }

      return result;
    } catch (error) {
      console.error("Google 로그인 실패:", error);
      throw error;
    }
  };

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
  );
};

// 사용자 정의 훅
export const useAuth = () => useContext(AuthContext);
