"use client"

import React, {useState} from "react";
import {getErrorMessage} from "@/utils";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {createSession, signUp} from "@/lib/session";
import {signInWithCustomToken} from "@firebase/auth";
import {auth} from "@/firebase/client/config";
import {LoadingButton} from "@/components/ui/loading-button";

const SignUp = () => {
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
            const displayName = form.displayName.value;
            const email = form.email.value;
            const password = form.password.value;

            const customToken = await signUp(displayName, email, password)
            const {user} = await signInWithCustomToken(auth, customToken)
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
                    Create an account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={onSubmit} className="space-y-5">
                    <Input
                        id="displayName"
                        name="displayName"
                        placeholder="Name"
                        onChange={handleChange}
                    />

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

                    <LoadingButton className="w-full" type="submit" loading={loading}>Create Account</LoadingButton>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/auth/log-in" className="font-semibold leading-6 text-black">
                        Log in here.
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp