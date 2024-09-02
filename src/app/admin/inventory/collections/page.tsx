import {getCollections} from "@/firebase/admin/firestore/collections";
import Table from "@/components/admin/inventory/collections/table";

const CollectionsPage = async () => {
    const collections = await getCollections()
    return <Table collections={collections}/>
}

export default CollectionsPage