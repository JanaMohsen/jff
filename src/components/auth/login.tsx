"use client"

import React, {useState} from "react";
import {auth} from "@/firebase/client/config";
import {inMemoryPersistence, signInWithEmailAndPassword} from "@firebase/auth";
import {getErrorMessage} from "@/utils";
import Link from "next/link";
import {createSession} from "@/lib/session";
import {Input} from "@/components/ui/input";
import {LoadingButton} from "@/components/ui/loading-button";

const LogIn = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("");

    function handleChange() {
        setError("");
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        try {
            const form = e.currentTarget;
            const email = form.email.value;
            const password = form.password.value;

            await auth.setPersistence(inMemoryPersistence)
            const {user} = await signInWithEmailAndPassword(auth, email, password);
            await createSession(await user.getIdToken())
        } catch (e) {
            setError(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to JFF
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={onSubmit} className="space-y-5">
                    <Input
                        id="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        autoComplete="on"
                    />

                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        autoComplete="off"
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    <LoadingButton className="w-full" type="submit" loading={loading}>Continue</LoadingButton>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/sign-up" className="font-semibold leading-6 text-black">
                        Sign up here.
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LogIn