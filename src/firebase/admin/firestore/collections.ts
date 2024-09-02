"use server"

import {Collection, Menu, FirebaseCollection} from "@/lib/shopify/types";
import {admin} from "@/firebase/admin/config"
import {
    allCategory,
} from "@/constants";
import {revalidatePath} from "next/cache";
import {validateDescription, validateHandle, validateTitle} from "@/utils/validation";

export async function getCollections(): Promise<Collection[]> {
    const db = admin.firestore()
    const collectionRef = db.collection('collections');

    const collections = await collectionRef.get()

    return collections.docs.map(collection => {
        const data = collection.data() as FirebaseCollection
        return {
            id: collection.id,
            path: `/search/${data.handle}`,
            ...data
        }
    })
}

export async function editCollection(id: string, title: string, description: string, handle: string, path: string) {
    validateTitle(title)
    validateDescription(description)
    validateHandle(handle)

    const collection = await getCollectionByHandle(handle)
    if (collection != null && collection.id != id)
        throw new Error(`The ${handle} handle is already in use.`)

    const db = admin.firestore()
    await db.collection("collections").doc(id).update({title, description, handle})

    revalidatePath(path)
}

export async function addCollection(title: string, description: string, handle: string, path: string) {
    validateTitle(title)
    validateDescription(description)
    validateHandle(handle)

    if (await getCollectionByHandle(handle) != null)
        throw new Error(`The ${handle} handle is already in use.`)

    const db = admin.firestore()
    await db.collection("collections").add({title, description, handle})

    revalidatePath(path)
}

export async function getCollectionByHandle(handle: string): Promise<Collection | null> {
    try {
        const db = admin.firestore();
        const collectionRef = db.collection('collections');
        const querySnapshot = await collectionRef.where('handle', '==', handle).get();

        if (querySnapshot.empty) return null

        const doc = querySnapshot.docs[0]
        const data = doc.data() as FirebaseCollection;
        return {
            id: doc.id,
            path: `/search/${data.handle}`,
            ...data
        }
    } catch (error) {
        return null
    }
}

export async function getMenu(addAll: boolean = false): Promise<Menu[]> {
    const db = admin.firestore();
    const collectionRef = db.collection('collections');
    const querySnapshot = await collectionRef.get()
    const menu = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirebaseCollection
        return {
            path: `/search/${data.handle}`,
            title: data.title,
        }
    });
    if (addAll) menu.unshift({path: allCategory.path, title: allCategory.title})
    return menu
}