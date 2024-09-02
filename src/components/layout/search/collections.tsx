import clsx from 'clsx';
import {Suspense} from 'react';
import {getCollections} from "@/firebase/client/firestore/collections";
import FilterList from "@/components/layout/search/filter";

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

const Collections = async () => {
    const collections = await getCollections(true)

    return (
        <Suspense
            fallback={
                <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
                    {[...Array(2)].map((_, index) => (
                        <div key={`title-${index}`} className={clsx(skeleton, activeAndTitles)}/>
                    ))}
                    {[...Array(4)].map((_, index) => (
                        <div key={`item-${index}`} className={clsx(skeleton, items)}/>
                    ))}
                </div>
            }
        >
            <FilterList list={collections} title="Collections"/>
        </Suspense>
    );
}

export default Collections