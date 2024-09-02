import {ReactNode} from 'react';
import Navbar from '@/components/layout/navbar';
import {getMenu} from "@/firebase/admin/firestore/collections";

const AuthLayout = async ({children}: { children: ReactNode }) => {
    const menu = await getMenu(true);

    return (
        <>
            <Navbar menu={menu} disableSearch disableCart/>
            <main>{children}</main>
        </>
    );
}

export default AuthLayout