import {getProduct} from "@/firebase/admin/firestore/products";
import {notFound} from "next/navigation";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Edit from "@/components/admin/inventory/products/edit";
import {getCollections} from "@/firebase/admin/firestore/collections";
import Table from "@/components/admin/inventory/products/variants/table";

const Product = async ({params}: { params: { productId: string } }) => {
    const product = await getProduct(params.productId)
    const collections = await getCollections()
    if (!product) notFound()

    return <Tabs defaultValue="productInfo">
        <TabsList>
            <TabsTrigger value="productInfo">Product information</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>
        <TabsContent value="productInfo">
            <Edit product={product} collections={collections}/>
        </TabsContent>
        <TabsContent value="variants">
            <Table product={product}/>
        </TabsContent>
    </Tabs>
}

export default Product