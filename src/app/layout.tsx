import './globals.css';
import {GeistSans} from 'geist/font/sans';
import {ReactNode} from 'react';
import {SITE_NAME} from "@/constants";
import {Toaster} from "@/components/ui/toaster";
import {getUser} from "@/lib/session";
import {AuthContextProvider} from "@/contexts/auth";
import Authorization from "@/components/authorization";
import {CartContextProvider} from "@/contexts/cart";

const baseUrl = process.env.NODE_ENV == "development" ?
    "http://localhost:3000" :
    `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

export const metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: SITE_NAME!,
        template: `%s | ${SITE_NAME}`
    },
    robots: {
        follow: true,
        index: true
    }
};

export default async function RootLayout({children}: { children: ReactNode }) {
    const user = await getUser()

    return (
        <Authorization user={user}>
            <AuthContextProvider user={user}>
                <CartContextProvider>
                    <html lang="en" className={GeistSans.variable}>
                    <body
                        className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
                    <main>{children}</main>
                    <Toaster/>
                    </body>
                    </html>
                </CartContextProvider>
            </AuthContextProvider>
        </Authorization>
    );
}
