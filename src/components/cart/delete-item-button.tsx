'use client';

import {XMarkIcon} from '@heroicons/react/24/outline';
import type {CartItem} from '@/lib/shopify/types';
import {useCart} from "@/hooks";

export function DeleteItemButton({item}: { item: CartItem }) {
    const {removeItem} = useCart()
    return (
        <button
            onClick={() => removeItem(item.product.id, item.product.variant.id)}
            className='ease flex h-[17px] w-[17px] items-center justify-center rounded-full bg-neutral-500 transition-all duration-200'
        >
            <XMarkIcon className="hover:text-accent-3 mx-[1px] h-4 w-4 text-white dark:text-black"/>
        </button>
    );
}