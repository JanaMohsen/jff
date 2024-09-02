"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {ArrowUpDown} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Product, Variant} from "@/lib/shopify/types";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import AddVariantForm from "@/components/admin/inventory/products/variants/add";
import EditVariantForm from "@/components/admin/inventory/products/variants/edit";
import * as React from "react";
import {getErrorMessage} from "@/utils";
import {useToast} from "@/components/ui/use-toast";
import {deleteVariant} from "@/firebase/admin/firestore/products";
import {usePathname} from "next/navigation";
import {LoadingButton} from "@/components/ui/loading-button";

export const createColumns = (product: Product): ColumnDef<Variant>[] => [
    {
        header: "Options",
        cell: ({row}) => {
            const {selectedOptions} = row.original;
            return (
                <div>
                    {selectedOptions.length > 0 && (
                        <ul>
                            {selectedOptions.map((option, index) => (
                                <li key={index}>
                                    <strong>{option.name}:</strong> {option.value}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        },
    },
    {
        header: "Available For Sale",
        cell: ({row}) => {
            return <div>{row.original.availableForSale ? "Yes" : "No"}</div>
        },
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        id: "actions",
        cell: ({row}) => {
            return <Actions variant={row.original} product={product}/>
        },
    },
]

const Actions = ({variant, product}: { variant: Variant, product: Product }) => {
    const {toast} = useToast()
    const pathname = usePathname()
    const [deleting, setDeleting] = useState(false)
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const onDelete = async () => {
        setDeleting(true)
        try {
            await deleteVariant(product.id, variant.id, pathname)
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Operation failed.",
                description: getErrorMessage(e)
            })
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Edit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit variant</DialogTitle>
                        <DialogDescription>
                            Make changes to the product variant here. Click save when you are done.
                        </DialogDescription>
                    </DialogHeader>
                    <EditVariantForm product={product} variant={variant} setModalOpen={setModalOpen}/>
                </DialogContent>
            </Dialog>
            <LoadingButton variant="destructive" size="sm" className="ml-2" onClick={onDelete} loading={deleting}>
                Delete
            </LoadingButton>
        </>
    )
}

export default function VariantsTable({product}: { product: Product }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const columns = createColumns(product)

    const table = useReactTable({
        data: product.variants,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 5
            }
        }
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="ml-auto">Add variant</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add new variant</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to add a new variant to that product.
                            </DialogDescription>
                        </DialogHeader>
                        <AddVariantForm product={product} setModalOpen={setModalOpen}/>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {table.getPaginationRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}