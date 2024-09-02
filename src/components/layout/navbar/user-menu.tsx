"use client"

import {Menu, MenuItems, MenuItem, MenuButton} from "@headlessui/react"
import Image from "next/image";
import {UserIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import {isStaff} from "@/utils";
import {useUser} from "@/hooks";
import {signOut} from "@/lib/session";

const menuItemClasses = "block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 cursor-pointer"

const UserMenu = () => {
    const {user} = useUser()

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <MenuButton
                    className="relative flex max-w-xs w-8 h-8 items-center justify-center rounded-full bg-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300">
                    <span className="absolute -inset-1.5"/>
                    <span className="sr-only">Open user menu</span>
                    {user?.picture ?
                        <Image alt=""
                               fill
                               src={user?.picture || "/icons8-user-50.png"}
                               className="rounded-full"/>
                        : <UserIcon color="white" className="w-6 h-6"/>}
                </MenuButton>
            </div>
            <MenuItems transition
                       className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                {user ? <>
                    <MenuItem>
                        <Link href="/orders" className={menuItemClasses}>
                            My Orders
                        </Link>
                    </MenuItem>
                    {isStaff(user) && <MenuItem>
                        <Link href="/admin" className={menuItemClasses}>
                            Dashboard
                        </Link>
                    </MenuItem>}
                    <MenuItem>
                        <span onClick={() => signOut()} className={menuItemClasses}>
                            Sign out
                        </span>
                    </MenuItem>
                </> : <>
                    <MenuItem>
                        <Link href="/auth/log-in" className={menuItemClasses}>
                            Log In
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href="/auth/sign-up" className={menuItemClasses}>
                            Sign Up
                        </Link>
                    </MenuItem>
                </>}
            </MenuItems>
        </Menu>
    )
}

export default UserMenu