import {ThreeItemGrid} from '@/components/grid/three-items';
import Footer from '@/components/layout/footer';
import Navbar from "@/components/layout/navbar";
import {getMenu} from "@/firebase/admin/firestore/collections";

export const metadata = {
    description: 'Explore the latest in women’s fashion with our high-performance ecommerce store.' +
        ' Discover trendy dresses, stylish tops, and must-have accessories.',
    openGraph: {
        type: 'website'
    }
};

export default async function HomePage() {
    const menu = await getMenu(true)

    return (
        <>
            <Navbar menu={menu}/>
            <ThreeItemGrid/>
            <Footer/>
        </>
    );
}
