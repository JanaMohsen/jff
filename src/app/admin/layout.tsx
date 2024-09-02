import {ReactNode} from 'react';
import Navbar from "@/components/layout/navbar";
import {Menu} from "@/lib/shopify/types";
import Container from "@/components/layout/container";
import {getUser} from "@/lib/session";

const menu: Menu[] = [
    {
        path: "/admin/staff",
        title: "Staff"
    },
    {
        path: "/admin/inventory/collections",
        title: "Collections"
    },
    {
        path: "/admin/inventory/products",
        title: "Products"
    },
    {
        path: "/admin/orders",
        title: "Orders"
    },
    {
        path: "/admin/trending",
        title: "What's Trending"
    }
]

const AdminLayout = async ({children}: { children: ReactNode }) => {
    return (
        <>
            <Navbar menu={menu} menuLimit={5} disableSearch disableCart/>
            <main>
                <Container>{children}</Container>
            </main>
        </>
    );
}

export default AdminLayout