import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";
import { formatNepaliCurrency } from "@/utils/formatNepaliCurrency";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";


export const salesColumns = (): ColumnDef<any>[] =>  {
  // const router = useRouter();
 return [
    {
      header: "Invoice #",
      accessorKey: "invoice_no",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.invoice_no}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "invoice_date",
      cell: ({ row }) =>
        dayjs(row.original.invoice_date).format("YYYY-MM-DD"),
    },
    {
      header: "Customer",
      accessorKey: "customer.name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.customer?.name}</p>
          <p className="text-xs text-gray-500">
            {row.original.customer?.code}
          </p>
        </div>
      ),
    },
    {
      header: "Gross",
      accessorKey: "gross_amount",
      cell: ({ row }) => (
        <span className="text-right block">
          {formatNepaliCurrency(row.original.gross_amount)}
        </span>
      ),
    },
    {
      header: "Discount",
      accessorKey: "discount_amount",
      cell: ({ row }) => (
        <span className="text-right block text-red-600">
          {formatNepaliCurrency(row.original.discount_amount || 0)}
        </span>
      ),
    },
    {
      header: "VAT",
      accessorKey: "vat_amount",
      cell: ({ row }) => (
        <span className="text-right block text-dark-600">
          {formatNepaliCurrency(row.original.vat_amount)}
        </span>
      ),
    },
    {
      header: "Net Total",
      accessorKey: "total_amount",
      cell: ({ row }) => (
        <span className="text-right block font-semibold text-green-700">
          {formatNepaliCurrency(row.original.total_amount)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium
            ${
              row.original.status === "paid"
                ? "bg-green-100 text-green-700"
                : row.original.status === "partial"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }
          `}
        >
          {row.original.status.toUpperCase()}
        </span>
      ),
    },
    // {
    //   header: "Action",
    //   id: "actions",
    //   cell: ({ row }) => (
    //     <Button
    //       size="icon"
    //       variant="ghost"
    //       className="text-blue-600 hover:bg-blue-50"
    //       title="View Sale"
    //       onClick={() =>
    //         router.push(`/dashboard/admin/sales/${row.original.id}`)
    //       }
    //     >
    //       <Eye size={16} />
    //     </Button>
    //   ),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex gap-3 text-center items-center">
            <a
              href={`/dashboard/admin/sales/${item.id}`}
              className="text-emerald-600 hover:text-emerald-800"
              title="View Purchase"
            >
              <Eye size={18} />
            </a>
          </div>
        );
      },
    },
  ]
};
