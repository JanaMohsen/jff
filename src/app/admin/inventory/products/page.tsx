import {getProducts} from "@/firebase/admin/firestore/products";
import Table from "@/components/admin/inventory/products/table";

const ProductsPage = async () => {
    const products = await getProducts()
    return <Table products={products}/>
}

export default ProductsPage