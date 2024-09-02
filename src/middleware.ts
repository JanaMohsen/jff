import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {CURRENT_PATH_HEADER} from "@/constants";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    response.headers.set(CURRENT_PATH_HEADER, request.nextUrl.pathname);
    return response;
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};