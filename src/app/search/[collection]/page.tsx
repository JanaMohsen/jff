import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getCollectionByHandle} from "@/firebase/admin/firestore/collections";
import {NextSearchParams} from "@/lib/shopify/types";
import {getSortFilterItem} from "@/utils";
import SearchResults from "@/components/layout/search/algolia";

interface Props {
    params: { collection: string }
    searchParams?: NextSearchParams
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const collection = await getCollectionByHandle(params.collection)
    if (!collection) return notFound()
    return {
        title: collection.title,
        description: collection.description
    }
}

export default async function CategoryPage({params, searchParams}: Props) {
    const collection = await getCollectionByHandle(params.collection)
    if (!collection) return notFound()
    return <SearchResults
        filters={[`category:collections/${collection.id}`]}
        sortByIndex={getSortFilterItem(searchParams?.sort).index}
    />
}