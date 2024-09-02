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
import {UserRecord} from "firebase-admin/auth";
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import EditStaffForm from "@/components/admin/staff/edit";
import {capitalize, getErrorMessage} from "@/utils";
import AddStaffForm from "@/components/admin/staff/add";
import {deleteStaffMember} from "@/firebase/admin/auth";
import {usePathname} from "next/navigation";
import {useToast} from "@/components/ui/use-toast"
import {LoadingButton} from "@/components/ui/loading-button";

export const columns: ColumnDef<UserRecord>[] = [
    {
        accessorKey: "displayName",
        header: ({column}) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Display Name
                <ArrowUpDown className="ml-2 h-4 w-4"/>
            </Button>
        ),
    },
    {
        accessorKey: "email",
        header: ({column}) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4"/>
            </Button>
        ),
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
    },
    {
        id: "role",
        header: "Role",
        cell: ({row}) => {
            return <div>{capitalize(row.original.customClaims?.role)}</div>
        },
    },
    {
        id: "actions",
        cell: ({row}) => {
            return <Actions user={row.original}/>
        },
    },
]

const Actions = ({user}: { user: UserRecord }) => {
    const pathname = usePathname()
    const {toast} = useToast()
    const [deleting, setDeleting] = useState(false)
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const onDelete = async () => {
        setDeleting(true)
        try {
            await deleteStaffMember(user.uid, pathname)
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
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to the profile here. Click save when you are done.
                        </DialogDescription>
                    </DialogHeader>
                    <EditStaffForm user={user} setModalOpen={setModalOpen}/>
                </DialogContent>
            </Dialog>
            <LoadingButton variant="destructive" size="sm" className="ml-2" onClick={onDelete} loading={deleting}>
                Delete
            </LoadingButton>
        </>
    )
}

export default function StaffDataTable({staff}: { staff: UserRecord[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const table = useReactTable({
        data: staff,
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
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter names..."
                    value={(table.getColumn("displayName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("displayName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="ml-auto">Add staff</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add new staff</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to add a new user to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <AddStaffForm setModalOpen={setModalOpen}/>
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