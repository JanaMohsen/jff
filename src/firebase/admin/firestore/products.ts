"use server"

import {
    Product,
    FirebaseProduct,
    Variant,
    FirebaseVariant,
    Collection,
    FirebaseCollection, Option, LabeledProduct,
} from "@/lib/shopify/types";
import {admin} from "@/firebase/admin/config";
import {DocumentReference} from "@google-cloud/firestore"
import {
    validateDescription,
    validateImages,
    validateOptions, validatePrice,
    validateQuantity,
    validateTitle
} from "@/utils/validation";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {getObjectLabels} from "@/lib/algolia/server";

export async function getProduct(productId: string): Promise<Product | null> {
    const db = admin.firestore()
    const collectionRef = db.collection('products')

    const productRef = collectionRef.doc(productId)
    const productDoc = await productRef.get()

    if (!productDoc.exists) return null

    const data = productDoc.data() as FirebaseProduct
    const category = await getCategory(data.category)
    const variants = await getVariants(productDoc.ref)
    return {...data, id: productDoc.id, variants: variants, category}
}

export async function getProducts(): Promise<LabeledProduct[]> {
    const db = admin.firestore();
    const collectionRef = db.collection('products');

    const productsSnapshot = await collectionRef.get();

    return await Promise.all(productsSnapshot.docs.map(async (product) => {
        const data = product.data() as FirebaseProduct;
        const category = await getCategory(data.category)
        const variants = await getVariants(product.ref);
        return {
            ...data,
            id: product.id,
            variants: variants,
            category,
            labels: await getObjectLabels(product.id)
        };
    }));
}

export async function getVariants(docRef: DocumentReference): Promise<Variant[]> {
    const variantsCollectionRef = docRef.collection("variants");
    const variantsSnapshot = await variantsCollectionRef.get();

    return variantsSnapshot.docs.map(variantDoc => {
        const variantData = variantDoc.data() as FirebaseVariant;
        return {
            id: variantDoc.id,
            ...variantData
        };
    });
}

export async function getCategory(categoryRef: DocumentReference): Promise<Collection> {
    const categorySnapshot = await categoryRef.get();
    const data = categorySnapshot.data() as FirebaseCollection
    return {
        id: categorySnapshot.id,
        path: `/search/${data.handle}`,
        ...data
    };
}

export async function addProduct(title: string, description: string, categoryId: string, price: number, options: Option[], images: string[], path: string) {
    const db = admin.firestore()
    validateTitle(title)
    validateDescription(description)
    const categoryRef = db.collection("collections").doc(categoryId)
    if (!(await categoryRef.get()).exists) throw new Error(`Category with id "${categoryId}" doesn't exist.`)
    validatePrice(price)
    validateOptions(options)
    validateImages(images)
    const collectionRef = db.collection('products')
    const product: FirebaseProduct = {title, description, category: categoryRef, price, options, images, reviews: []}
    await collectionRef.add(product)
    redirect(path)
}

export async function editProduct(id: string, title: string, description: string, categoryId: string, price: number, images: string[]) {
    const db = admin.firestore()
    validateTitle(title)
    validateDescription(description)
    const categoryRef = db.collection("collections").doc(categoryId)
    if (!(await categoryRef.get()).exists) throw new Error(`Category with id "${categoryId}" doesn't exist.`)
    validateImages(images)
    await db.collection('products').doc(id).update({title, description, category: categoryRef, price, images})
}

export async function addVariant(productId: string, quantity: number, availableForSale: boolean, selectedOptions: FirebaseVariant["selectedOptions"], path: string) {
    validateQuantity(quantity)

    const db = admin.firestore()
    const productRef = await db.collection("products").doc(productId)
    if (!(await productRef.get()).exists) throw new Error(`Product with id ${productId} does not exist.`)
    const newVariant: FirebaseVariant = {quantity, selectedOptions, availableForSale}
    await productRef.collection("variants").add(newVariant)
    revalidatePath(path)
}

export async function editVariant(productId: string, variantId: string, quantity: number, availableForSale: boolean, selectedOptions: FirebaseVariant["selectedOptions"], path: string) {
    validateQuantity(quantity)

    const db = admin.firestore()
    const variantRef = await db.collection("products").doc(productId).collection("variants").doc(variantId)
    await variantRef.update({quantity, selectedOptions, availableForSale})
    revalidatePath(path)
}

export async function deleteVariant(productId: string, variantId: string, path: string) {
    const db = admin.firestore()
    const variantRef = await db.collection("products").doc(productId).collection("variants").doc(variantId)
    await variantRef.delete()
    revalidatePath(path)
}