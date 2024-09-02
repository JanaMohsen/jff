import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Footer from '@/components/layout/footer';
import {Gallery} from '@/components/product/gallery';
import {ProductDescription} from '@/components/product/product-description';
import {Suspense} from 'react';
import {getProduct} from "@/firebase/admin/firestore/products";
import RelatedProducts from "@/components/layout/related-products";

interface Props {
    params: { productId: string };
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const product = await getProduct(params.productId)
    if (!product) return notFound()
    return {
        title: product.title,
        description: product.description,
    }
}

export default async function ProductPage({params}: Props) {
    const product = await getProduct(params.productId)
    if (!product) return notFound()

    return (
        <>
            <div className="mx-auto max-w-screen-2xl px-4">
                <div
                    className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
                    <div className="h-full w-full basis-full lg:basis-4/6">
                        <Suspense
                            fallback={
                                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden"/>
                            }
                        >
                            <Gallery productTitle={product.title} images={product.images}/>
                        </Suspense>
                    </div>

                    <div className="basis-full lg:basis-2/6">
                        <ProductDescription product={product}/>
                    </div>
                </div>
                <RelatedProducts id={product.id}/>
            </div>
            <Footer/>
        </>
    );
}