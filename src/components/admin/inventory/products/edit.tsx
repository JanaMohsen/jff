"use client"

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ChangeEvent, FormEvent, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {getErrorMessage} from "@/utils";
import {Collection, Product} from "@/lib/shopify/types";
import {InputTags} from "@/components/ui/input-tags";
import {GripHorizontal, LucideX} from "lucide-react";
import {arrayMoveImmutable} from "array-move";
import SortableList, {SortableItem, SortableKnob} from "react-easy-sort";
import Image from "next/image";
import {uploadProductImage} from "@/firebase/client/storage";
import {editProduct} from "@/firebase/admin/firestore/products";
import {MIN_PRICE} from "@/constants";
import {LoadingButton} from "@/components/ui/loading-button";

const Edit = ({product, collections}: { product: Product, collections: Collection[] }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [isGrabbing, setIsGrabbing] = useState<boolean>(false)
    const [images, setImages] = useState<{ file?: File, url: string }[]>(product.images.map(image => {
        return {url: image}
    }))

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        emptyErr()
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files).map(file => ({
                file,
                url: URL.createObjectURL(file)
            }));
            setImages(prevImages => [...prevImages, ...selectedFiles]);
        }
    };

    const handleMouseDown = () => {
        setIsGrabbing(true);
    };

    const handleMouseUp = () => {
        setIsGrabbing(false);
    };

    const onSortEnd = (oldIndex: number, newIndex: number) => {
        setImages((array) => arrayMoveImmutable(array, oldIndex, newIndex))
    }

    const deleteImage = (indexToDelete: number) => {
        emptyErr()
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToDelete));
    };

    const emptyErr = () => {
        setError("")
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setLoading(true)
            const formData = new FormData(e.currentTarget)
            await editProduct(
                product.id,
                formData.get("title") as string,
                formData.get("description") as string,
                formData.get("categoryId") as string,
                parseFloat(formData.get("price") as string),
                await uploadImagesToStorage(),
            )
        } catch (e) {
            setError(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    const uploadImagesToStorage = async () => {
        const updatedUrls: string[] = []
        for (let i = 0; i < images.length; i++) {
            const image = images[i]
            if (image.file) {
                const url = await uploadProductImage(image.file)
                setImages(prevImages => {
                    const newImages = [...prevImages]
                    newImages[i] = {url: url}
                    return newImages
                })
                updatedUrls.push(url)
            } else {
                updatedUrls.push(image.url)
            }
        }
        return updatedUrls
    }

    return <div className="flex justify-center my-5">
        <div className="w-[500px]">
            <form className="space-y-5" onSubmit={onSubmit}>
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        required
                        placeholder="e.g. Elegant Summer Dress"
                        defaultValue={product.title}
                        onChange={emptyErr}/>
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="e.g. A beautiful, lightweight dress perfect for summer outings. Available in multiple colors and sizes."
                        defaultValue={product.description}
                        onChange={emptyErr}
                    />
                </div>
                <div>
                    <Label htmlFor="categoryId">Category</Label>
                    <Select name="categoryId" required defaultValue={product.category.id} onValueChange={emptyErr}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {collections.map(collection => {
                                    return <SelectItem key={collection.id}
                                                       value={collection.id}>{collection.title}</SelectItem>
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="price">Price (usd)</Label>
                    <Input id="price" name="price" min={MIN_PRICE} defaultValue={product.price} required
                           onChange={emptyErr}/>
                </div>
                <div>
                    <Label>Options</Label>
                    {product.options.map((option, index) => (
                        <div key={index} className="flex space-x-3 mb-3">
                            <div className="w-1/4 flex items-start space-x-2">
                                <Input value={option.name} readOnly/>
                            </div>
                            <div className="w-3/4">
                                <InputTags value={option.values} onChange={() => {
                                }} readOnly/>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <Label htmlFor="images">Images</Label>
                    <Input type="file" multiple onChange={handleImageChange} accept=".jpg,.png"/>
                    {images.length !== 0 &&
                        <SortableList onSortEnd={onSortEnd} className="mt-5 grid grid-cols-auto-fit gap-10"
                                      draggedItemClassName="dragged">
                            {images.map((image, index) => (
                                <SortableItem key={index}>
                                    <div>
                                        <div className="relative w-[100px] h-[100px]">
                                            <Image
                                                src={image.url}
                                                alt="Picture of the author"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute -top-2.5 -left-2.5">
                                                <SortableKnob>
                                                    <Button variant="outline" size="icon" type="button"
                                                            className={`h-6 w-6 ${isGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
                                                            onMouseDown={handleMouseDown}
                                                            onMouseUp={handleMouseUp}
                                                            onMouseLeave={handleMouseUp}>
                                                        <GripHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </SortableKnob>
                                            </div>
                                            <div className="absolute -top-2.5 -right-2.5">
                                                <Button variant="outline" size="icon" className="h-6 w-6" type="button"
                                                        onClick={() => deleteImage(index)}>
                                                    <LucideX className="h-4 w-4" color="red"/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </SortableItem>
                            ))}
                        </SortableList>}
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <LoadingButton className="w-full" type="submit" loading={loading}>
                    Save changes
                </LoadingButton>
            </form>
        </div>
    </div>
}

export default Edit