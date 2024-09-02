"use client"

import {createContext, ReactNode, useState, useEffect} from "react";
import {Cart, Product} from "@/lib/shopify/types";
import {CART_LOCAL_STORAGE} from "@/constants";

interface CartContextProps {
    cart: Cart | undefined;
    addItem: (product: Product, variantId: string, quantity: number) => void;
    removeItem: (productId: string, variantId: string) => void;
    incrementItem: (productId: string, variantId: string) => void;
    decrementItem: (productId: string, variantId: string) => void;
    emptyCart: () => void;
}

export const CartContext = createContext<CartContextProps>({
    cart: undefined,
    addItem: () => {
    },
    removeItem: () => {
    },
    incrementItem: () => {
    },
    decrementItem: () => {
    },
    emptyCart: () => {
    }
});

export const CartContextProvider = ({children}: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart | undefined>(undefined);

    useEffect(() => {
        if (cart === undefined) {
            const storedCart = localStorage.getItem(CART_LOCAL_STORAGE);
            if (storedCart) setCart(JSON.parse(storedCart));
            else setCart({items: []});
        }
    }, [cart]);

    useEffect(() => {
        if (cart !== undefined)
            localStorage.setItem(CART_LOCAL_STORAGE, JSON.stringify(cart));
    }, [cart]);

    const addItem = (product: Product, variantId: string, quantity: number): void => {
        if (!cart) return;

        const variant = product.variants.find(v => v.id === variantId);
        if (!variant) return;

        const availableQuantity = variant.quantity;
        const adjustedQuantity = Math.min(quantity, availableQuantity);

        const newCartItems = [...cart.items];
        const existingItemIndex = newCartItems.findIndex(
            (i) => i.product.id === product.id && i.product.variant.id === variantId
        );

        if (existingItemIndex !== -1) {
            const currentQuantity = newCartItems[existingItemIndex].quantity;
            const newQuantity = Math.min(currentQuantity + adjustedQuantity, availableQuantity);
            newCartItems[existingItemIndex] = {
                ...newCartItems[existingItemIndex],
                quantity: newQuantity,
            };
        } else {
            if (adjustedQuantity > 0) {
                newCartItems.push({
                    product: {
                        id: product.id,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        images: product.images,
                        variant: variant,
                    },
                    quantity: adjustedQuantity,
                });
            }
        }

        setCart({items: newCartItems});
    };

    const removeItem = (productId: string, variantId: string): void => {
        if (!cart) return;

        const newCartItems = cart.items.filter(
            (item) => !(item.product.id === productId && item.product.variant.id === variantId)
        );

        setCart({items: newCartItems});
    };

    const incrementItem = (productId: string, variantId: string): void => {
        if (!cart) return;

        const newCartItems = [...cart.items];
        const itemIndex = newCartItems.findIndex(
            (i) => i.product.id === productId && i.product.variant.id === variantId
        );

        if (itemIndex !== -1) {
            const item = newCartItems[itemIndex];
            const variant = item.product.variant;
            const availableQuantity = variant.quantity;
            const newQuantity = Math.min(item.quantity + 1, availableQuantity);

            newCartItems[itemIndex] = {
                ...item,
                quantity: newQuantity,
            };

            if (newQuantity === availableQuantity) {
                newCartItems[itemIndex] = {
                    ...item,
                    quantity: availableQuantity,
                };
            }

            setCart({items: newCartItems});
        }
    };

    const decrementItem = (productId: string, variantId: string): void => {
        if (!cart) return;

        const newCartItems = [...cart.items];
        const itemIndex = newCartItems.findIndex(
            (i) => i.product.id === productId && i.product.variant.id === variantId
        );

        if (itemIndex !== -1) {
            const item = newCartItems[itemIndex];
            const newQuantity = item.quantity - 1;

            if (newQuantity <= 0) {
                newCartItems.splice(itemIndex, 1);
            } else {
                newCartItems[itemIndex] = {
                    ...item,
                    quantity: newQuantity,
                };
            }

            setCart({items: newCartItems});
        }
    };

    const emptyCart = () => {
        setCart({items: []});
    };

    return (
        <CartContext.Provider value={{cart, addItem, removeItem, incrementItem, decrementItem, emptyCart}}>
            {children}
        </CartContext.Provider>
    );
};
