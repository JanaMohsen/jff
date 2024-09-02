"use client"

import * as React from "react"
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
import {Button} from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useState} from "react";
import {capitalize, formatNb, getErrorMessage} from "@/utils";
import {usePathname} from "next/navigation";
import {useToast} from "@/components/ui/use-toast"
import {LoadingButton} from "@/components/ui/loading-button";
import {Order} from "@/lib/shopify/types";
import {updateOrder} from "@/firebase/admin/firestore/orders";

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "id",
        header: "Order id"
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone number"
    },
    {
        accessorKey: "address",
        header: "Address"
    },
    {
        id: "total",
        header: "Total cost ($)",
        cell: ({row}) => {
            return <>{formatNb(row.original.items.reduce((total, item) => total + (item.quantity * item.price), 0))}</>
        }
    },
    {
        id: "shippingCost",
        header: "Shipping cost ($)",
        cell: ({row}) => {
            return <>{formatNb(row.original.shippingCost)}</>
        }
    },
    {
        accessorKey: "discount",
        header: "Discount (%)"
    },
    {
        id: "status",
        header: "Status",
        cell: ({row}) => {
            return <>{capitalize(row.original.status)}</>
        }
    },
    {
        id: "actions",
        cell: ({row}) => {
            return <Actions order={row.original}/>
        },
    },
]

const Actions = ({order}: { order: Order }) => {
    const pathname = usePathname()
    const {toast} = useToast()
    const [loading, setLoading] = useState(false)

    const isPending = () => {
        return order.status === "pending"
    }

    const isDelivered = () => {
        return order.status === "delivered"
    }

    const bumpStatus = async () => {
        setLoading(true)
        try {
            const newStatus = isPending() ? "shipped" : "delivered"
            await updateOrder(order.id, newStatus, pathname)
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

    if (isDelivered()) {
        return null
    } else {
        return (
            <LoadingButton size="sm" className="ml-2" onClick={bumpStatus} loading={loading}>
                {isPending() ? "Mark as shipped" : "Mark as delivered"}
            </LoadingButton>
        )
    }
}

export default function OrdersDataTable({orders}: { orders: Order[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const table = useReactTable({
        data: orders,
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
                pageSize: 5,
            }
        }
    })

    return (
        <div className="w-full">
            <div className="rounded-md border my-4">
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
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
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