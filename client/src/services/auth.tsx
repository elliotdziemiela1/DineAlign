import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, UserCredential } from "firebase/auth";
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '..';

const firebaseConfig = {
    apiKey: "AIzaSyD6YA5Y68wuc9XFT8qzvRtoLRRgNZ73YvI",
    authDomain: "dinealign-auth.firebaseapp.com",
    projectId: "dinealign-auth",
    storageBucket: "dinealign-auth.firebasestorage.app",
    messagingSenderId: "669287388418",
    appId: "1:669287388418:web:f16bf6a147f187a9c2de1b",
    measurementId: "G-YVK1BXQLKH"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export interface AuthenticationResult {
    success: boolean;
    user?: UserCredential;
    error?: {
        code: string,
        message: string,
    }
}

export async function signUp(email: string, password: string): Promise<AuthenticationResult> {
    var result: AuthenticationResult = {
        success: true,
    }
    try {
        result.user = await createUserWithEmailAndPassword(auth, email, password);
        const token = await result.user.user.getIdToken();
        sessionStorage.setItem("accessToken", token);
    } catch (err: any) {
        result.success = false;
        result.error = {
            code: err.code,
            message: err.message,
        }
    }
    return result;
}

export async function signIn(email: string, password: string): Promise<AuthenticationResult> {
    var result: AuthenticationResult = {
        success: true,
    };
    try {
        result.user = await signInWithEmailAndPassword(auth, email, password);
        const token = await result.user.user.getIdToken();
        sessionStorage.setItem("accessToken", token);
    } catch (err: any) {
        result.success = false;
        result.error = {
            code: err.code,
            message: err.message,
        }
    }
    return result;
}

export async function signOut() {
    auth.signOut();
}

export function Authorize({ component }: {component: React.JSX.Element}) {
    const user = useContext(AuthContext);
    if (user === null) {
        return (
            <Navigate to="signin"/>
        )
    }
    return (
        component
    );
}