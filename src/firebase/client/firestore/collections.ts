import {Collection, FirebaseCollection} from "@/lib/shopify/types";
import {collection, getDocs} from "firebase/firestore";
import {firestore} from "@/firebase/client/config";
import {allCategory} from "@/constants";

export async function getCollections(addAll: boolean = false): Promise<Collection[]> {
    try {
        const collectionsRef = collection(firestore, "collections")
        const querySnapshot = await getDocs(collectionsRef)
        const collections = querySnapshot.docs.map(doc => {
            const data = doc.data() as FirebaseCollection
            return {
                id: doc.id,
                path: `/search/${data.handle}`,
                ...data
            }
        });
        if (addAll) collections.unshift(allCategory)
        return collections
    } catch (e) {
        return []
    }
}