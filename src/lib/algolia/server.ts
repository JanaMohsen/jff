"use server"

import {algoliasearch} from "algoliasearch"
import {LabeledProduct, VisionParsedLabel} from "@/lib/shopify/types";
import {getImageLabels} from "@/lib/vision";
import {revalidatePath} from "next/cache";

const writeClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string,
    process.env.ALGOLIA_WRITE_API_KEY as string
)

export const labelObjects = async (products: LabeledProduct[], path: string) => {
    const promises = products.map(async (product) => {
        if (product.labels === undefined) {
            const labels = await getImageLabels(product.images[0], 0.5);
            await addLabels(process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX as string, product.id, labels);
        }
    });
    await Promise.all(promises);
    revalidatePath(path);
};

export const getObjectLabels = async (objectId: string): Promise<VisionParsedLabel[] | undefined> => {
    try {
        return (await writeClient.getObject({
            indexName: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX,
            objectID: objectId,
            attributesToRetrieve: ['labels']
        })).labels
    } catch (e) {
        return undefined
    }
}

export const addLabels = async (indexName: string, objectID: string, labels: VisionParsedLabel[]) => {
    // @ts-ignore
    await writeClient.partialUpdateObject({
        indexName,
        objectID,
        attributesToUpdate: {labels: labels},
        createIfNotExists: false
    })
}