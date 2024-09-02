"use client"

import {createContext, ReactNode} from "react";
import {DecodedIdToken} from "firebase-admin/auth";

export const AuthContext = createContext<{
    user: DecodedIdToken | null;
}>({user: null})

export const AuthContextProvider = ({children, user}: { children: ReactNode, user: DecodedIdToken | null }) => {
    return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
}