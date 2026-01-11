"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { DataTable } from "@/components/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import SaleForm from "@/components/sales/SaleForm";
import { salesColumns } from "./sales-columns";

export default function SalesPage() {
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const loadSales = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/sales", { params: { page } });

      setData(res.data.data || []);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        per_page: res.data.per_page,
        total: res.data.total,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const columns = useMemo(
    () => salesColumns(loadSales),
    [loadSales]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard/admin" },
            { label: "Accounting" },
            { label: "Sales" },
          ]}
        />

        <Button
          className="bg-[#009966] text-white"
          onClick={() => setOpenForm(true)}
        >
          <Plus size={16} className="mr-2" />
          New Sale
        </Button>
      </div>

      <DataTable
        title="Sales Invoices"
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No sales found."
        pagination={{
          currentPage: pagination?.current_page,
          pageSize: pagination?.per_page,
          total: pagination?.total,
          onPageChange: (page) => loadSales(page),
        }}
      />

      <SaleForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        refresh={loadSales}
      />
    </div>
  );
}
