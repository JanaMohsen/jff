import Grid from '@/components/grid'
import {GridTileImage} from '@/components/grid/tile'
import {AlgoliaProductHit} from '@/lib/shopify/types'
import Link from 'next/link'

export default function ProductGridItems({products}: { products: AlgoliaProductHit[] }) {
    return (
        <>
            {products.map((product) => (
                <Grid.Item key={product.objectID} className="animate-fadeIn">
                    <Link className="relative inline-block h-full w-full" href={`/product/${product.objectID}`}>
                        <GridTileImage
                            alt={product.title}
                            label={{
                                title: product.title,
                                amount: product.price
                            }}
                            src={product.images[0]}
                            fill
                            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                    </Link>
                </Grid.Item>
            ))}
        </>
    )
}