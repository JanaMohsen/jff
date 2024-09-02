import {getSortFilterItem} from "@/utils";
import {NextSearchParams} from "@/lib/shopify/types";
import SearchResults from "@/components/layout/search/algolia";

export const metadata = {
    title: 'Search',
    description: 'Search for products in the store.'
};

export default async function SearchPage({searchParams}: { searchParams?: NextSearchParams }) {
    const {sort, q: searchValue, labels} = searchParams as { [key: string]: string };
    const sortFilterItem = getSortFilterItem(sort)
    const parsedLabels = labels ? JSON.parse(labels) : []
    return <SearchResults q={searchValue} sortByIndex={sortFilterItem.index} labels={parsedLabels}/>
}