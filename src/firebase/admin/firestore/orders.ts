"use server"

import {Cart, FirebaseOrder, Order} from "@/lib/shopify/types";
import {admin} from "@/firebase/admin/config";
import {
    validateAddress,
    validateCart,
    validateDiscount,
    validatePhoneNumber,
    validateShippingCost,
} from "@/utils/validation";
import {getUser} from "@/lib/session";
import {revalidatePath} from "next/cache";

export async function getOrders(): Promise<Order[]> {
    const db = admin.firestore()
    const collectionRef = db.collection('orders');

    const orders = await collectionRef.get()

    return orders.docs.map(order => {
        const data = order.data() as FirebaseOrder
        return {
            id: order.id,
            ...data,
            items: data.items.map(item => ({
                ...item,
                productVariant: item.productVariant.path
            }))
        }
    })
}

export async function addOrder(cart: Cart, phoneNumber: string, address: string, discount: number, shippingCost: number) {
    const user = await getUser()
    if (!user) throw new Error("User must be authenticated.")
    const db = admin.firestore();
    validateCart(cart);
    validatePhoneNumber(phoneNumber);
    validateAddress(address);
    validateDiscount(discount);
    validateShippingCost(shippingCost);
    const items: FirebaseOrder["items"] = [];
    await Promise.all(
        cart.items.map(async (cartItem) => {
            const variantRef = db
                .collection("products")
                .doc(cartItem.product.id)
                .collection("variants")
                .doc(cartItem.product.variant.id);

            if ((await variantRef.get()).exists) {
                items.push({
                    productVariant: variantRef,
                    quantity: cartItem.quantity,
                    price: cartItem.product.price
                });
            }
        })
    );
    const order: FirebaseOrder = {
        items,
        phoneNumber,
        discount,
        shippingCost,
        address,
        userId: user.uid,
        status: "pending"
    };
    await db.collection("orders").add(order);
}

export async function updateOrder(id: string, status: Order["status"], pathname: string): Promise<void> {
    const db = admin.firestore()
    await db.collection('orders').doc(id).update({status})
    revalidatePath(pathname)
}

export async function getUserOrders(): Promise<Order[]> {
    const user = await getUser();
    if (!user) throw new Error("User must be authenticated.");

    const db = admin.firestore();
    const collectionRef = db.collection('orders');

    const ordersQuery = collectionRef.where('userId', '==', user.uid);
    const orders = await ordersQuery.get();

    return orders.docs.map(order => {
        const data = order.data() as FirebaseOrder;
        return {
            id: order.id,
            ...data,
            items: data.items.map(item => ({
                ...item,
                productVariant: item.productVariant.path
            }))
        };
    });
}