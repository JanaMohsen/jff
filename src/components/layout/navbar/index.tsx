import OpenCart from '@/components/cart/open-cart';
import LogoSquare from '@/components/logo-square';
import {Menu} from '@/lib/shopify/types';
import Link from 'next/link';
import {Suspense} from 'react';
import MobileMenu from './mobile-menu';
import Search, {SearchSkeleton} from './search';
import UserMenu from "./user-menu";
import CartModal from "@/components/cart/modal";

interface Props {
    menu: Menu[];
    menuLimit?: number
    disableSearch?: boolean;
    disableCart?: boolean;
}

const Navbar = async ({menu, menuLimit = 3, disableSearch = false, disableCart = false}: Props) => {
    return (
        <nav className="relative flex items-center justify-between p-4 lg:px-6">
            <div className="block flex-none md:hidden">
                <Suspense fallback={null}>
                    <MobileMenu menu={menu} disableSearch/>
                </Suspense>
            </div>
            <div className="flex w-full items-center justify-between">
                <div className="flex w-full md:w-1/3">
                    <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
                        <LogoSquare/>
                    </Link>
                    {menu.length ? (
                        <ul className="hidden gap-6 text-sm md:flex md:items-center">
                            {menu.slice(0, menuLimit).map((item: Menu) => (
                                <li key={item.title}>
                                    <Link
                                        href={item.path}
                                        className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
                {!disableSearch && <div className="hidden justify-center md:flex md:w-1/3">
                    <Suspense fallback={<SearchSkeleton/>}>
                        <Search/>
                    </Suspense>
                </div>}
                <div className="flex justify-end md:w-1/3">
                    <div className="flex items-center space-x-4">
                        {!disableCart && <Suspense fallback={<OpenCart/>}>
                            <CartModal/>
                        </Suspense>}
                        <UserMenu/>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar