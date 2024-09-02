import {DecodedIdToken} from "firebase-admin/auth";
import {ReactNode} from "react";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {CURRENT_PATH_HEADER} from "@/constants";
import {isStaff} from "@/utils";

const isAuthPage = (path: string) => {
    return ["/auth/log-in", "/auth/sign-up"].includes(path);
}

const isDashboard = (path: string) => {
    return path.startsWith("/admin")
}

const isProtected = (path: string) => {
    return ["/orders"].includes(path)
}

const Authorization = ({user, children}: { user: DecodedIdToken | null, children: ReactNode }) => {
    const headerList = headers();
    const pathname = headerList.get(CURRENT_PATH_HEADER) || "";
    if (!!user && isAuthPage(pathname)) redirect("/")
    else if (isDashboard(pathname)) {
        if (!user) redirect("/auth/log-in")
        else if (!isStaff(user)) redirect("/")
    } else if (isProtected(pathname)) {
        if (!user) redirect("/auth/log-in")
    }
    return <>{children}</>
}

export default Authorization