import Container from "@/components/layout/container";
import Add from "@/components/admin/inventory/products/add";
import {getCollections} from "@/firebase/admin/firestore/collections";

const CreateProduct = async () => {
    const collections = await getCollections()
    return <Add collections={collections}/>
}

export default CreateProduct