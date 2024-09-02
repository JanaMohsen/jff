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
import {LabeledProduct} from "@/lib/shopify/types";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {formatNb, getErrorMessage} from "@/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {LoadingButton} from "@/components/ui/loading-button";
import {labelObjects} from "@/lib/algolia/server";
import {toast} from "@/components/ui/use-toast";

const createColumns = (products: LabeledProduct[]): ColumnDef<LabeledProduct>[] => [
    {
        id: "image",
        header: "Thumbnail",
        cell: ({row}) => {
            return <div className="relative h-14 w-14">
                <Image
                    className="h-full w-full object-cover"
                    fill
                    src={row.original.images[0]}
                    alt={row.original.title}
                    style={{objectFit: "contain"}}
                />
            </div>
        },
    },
    {
        accessorKey: "title",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
    },
    {
        id: "description",
        header: "Description",
        cell: ({row}) => {
            const description = row.original.description;
            const truncatedDescription = description.length > 100
                ? description.slice(0, 100) + "..."
                : description;

            return (
                <div>
                    {truncatedDescription}
                </div>
            );
        },
        size: 300,
    },
    {
        id: "labelsAndScores",
        header: ({column}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [loading, setLoading] = useState<boolean>(false)

            const onClick = async () => {
                setLoading(true)
                try {
                    await labelObjects(products, "/admin/inventory/products")
                } catch (e) {
                    toast({
                        variant: "destructive",
                        title: "Operation failed.",
                        description: getErrorMessage(e)
                    })
                } finally {
                    setLoading(false)
                }
            }

            return (
                <LoadingButton size="sm" variant="outline" onClick={onClick} loading={loading}>
                    Label images
                </LoadingButton>
            )
        },
        cell: ({row}) => {
            if (!row.original.labels)
                return <p>N/A</p>
            return <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">See labels</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    {row.original.labels.map((label, index) => {
                        return <DropdownMenuRadioItem key={index} value={label.description}>
                            {label.description} - {formatNb(label.score)}
                        </DropdownMenuRadioItem>
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        }
    },
    {
        accessorKey: "price",
        header: "Price (usd)",
    },
    {
        accessorKey: "category.title",
        header: "Category",
    },
    {
        id: "variantsCount",
        header: "# Variants",
        cell: ({row}) => <div>{row.original.variants.length}</div>,
    },
    {
        id: "actions",
        cell: ({row}) => {
            return <Button variant="outline" size="sm">
                <Link href={`/admin/inventory/products/${row.original.id}`}>Edit</Link>
            </Button>
        },
    },
]

export default function ProductsTable({products}: { products: LabeledProduct[] }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const columns = createColumns(products)

    const table = useReactTable({
        data: products,
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
                <Input
                    placeholder="Filter titles..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Button variant="outline" className="ml-auto" asChild>
                    <Link href={`/admin/inventory/products/new`}>Add product</Link>
                </Button>
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
                                        <TableCell key={cell.id} style={{width: cell.column.getSize()}}>
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
