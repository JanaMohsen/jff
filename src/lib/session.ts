"use server"

import {cookies} from 'next/headers'
import {admin} from "@/firebase/admin/config";
import {redirect} from "next/navigation";
import {validateDisplayName} from "@/utils/validation";

export async function getUser() {
    try {
        // @ts-ignore
        const sessionCookie = cookies().get("session")?.value || ""
        const auth = admin.auth()
        return await auth.verifySessionCookie(sessionCookie, true)
    } catch (e) {
        return null
    }
}

export async function createSession(idToken: string, redirectUrl: string = "/") {
    const auth = admin.auth()
    const maxAge = 60 * 60 * 24 * 5;
    const sessionCookie = await auth.createSessionCookie(idToken, {expiresIn: maxAge * 1000})
    // @ts-ignore
    cookies().set('session', sessionCookie, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: maxAge
    })
    redirect(redirectUrl)
}

export async function signUp(displayName: string, email: string, password: string, redirectUrl: string = "/") {
    validateDisplayName(displayName)
    const auth = admin.auth()
    const userRecord = await auth.createUser({displayName, email, password})
    return await auth.createCustomToken(userRecord.uid)
}

export async function signOut() {
    // @ts-ignore
    cookies().delete('session')
}