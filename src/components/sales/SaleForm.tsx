/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dayjs from "dayjs";
import { DatePicker, Select } from "antd";
import SaleItemsSection from "./SaleItemsSection";
import { formatNepaliCurrency } from "@/utils/formatNepaliCurrency";

export default function SaleForm({ open, onClose, refresh }: any) {
  const [loading, setLoading] = useState(false);

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState<number>(0);


  const [form, setForm] = useState<any>({
    customer_id: null,
    invoice_date: dayjs().format("YYYY-MM-DD"),
  });

  const [payment, setPayment] = useState<any>({
    amount: "",
    method: "cash",
    account_id: null,
    payment_date: dayjs().format("YYYY-MM-DD"),
  });

  useEffect(() => {
    if (!open) return;

    api.get("/parties", { params: { type: "customer" } })
      .then(res => setCustomers(res.data || []));

    api.get("/products")
      .then(res => setProducts(res.data || []));
  }, [open]);

  /* ---------------- Totals ---------------- */

  const grossAmount = useMemo(() =>
    items.reduce(
      (sum, i) => sum + Number(i.quantity || 0) * Number(i.selling_price || 0),
      0
    ), [items]
  );

  const vatAmount = useMemo(() =>
    items.reduce((sum, i) => {
      if (!i.vat_included) return sum;
      return sum + (Number(i.quantity) * Number(i.selling_price) * 0.13);
    }, 0)
  , [items]);

  const totalAmount = grossAmount + vatAmount;

  /* ---------------- Submit ---------------- */

  const handleSubmit = async () => {
    if (!form.customer_id) {
      toast.error("Customer is required");
      return;
    }

    if (items.length === 0) {
      toast.error("Add at least one product");
      return;
    }

    try {
      setLoading(true);

      await api.post("/sales", {
        ...form,
        items,
        discount_amount: discount,
        payment: payment.amount ? payment : null,
      });

      toast.success("Sale created");
      refresh();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <aside className="fixed top-0 right-0 z-50 h-full w-full sm:w-[900px] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold">New Sale</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-140px)]">

          {/* Customer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600">
                Customer
              </label>
              <Select
                showSearch
                allowClear
                className="w-full"
                placeholder="Select customer"
                value={form.customer_id ?? undefined}
                onChange={(v) => setForm({ ...form, customer_id: v })}
                options={customers.map(c => ({
                  value: c.id,
                  label: `${c.name} (${c.code})`,
                }))}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Invoice Date
              </label>
              <DatePicker
                className="w-full mt-1"
                value={dayjs(form.invoice_date)}
                onChange={(d) =>
                  setForm({ ...form, invoice_date: d?.format("YYYY-MM-DD") })
                }
              />
            </div>
          </div>

          {/* Items */}
          <SaleItemsSection
            value={items}
            onChange={setItems}
            products={products}
          />

          {/* Totals */}
          <div className="bg-[#F6FAF8] border rounded-xl p-4 grid grid-cols-3 text-sm">
            <div className="text-right">
              <p className="text-gray-500">Gross</p>
              <p className="font-semibold">
                {formatNepaliCurrency(grossAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">VAT</p>
              <p className="font-semibold">
                {formatNepaliCurrency(vatAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Total</p>
              <p className="font-semibold text-green-700">
                {formatNepaliCurrency(totalAmount)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Discount Amount
                </label>
                <Input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">Net Payable</p>
                <p className="font-semibold text-green-700">
                  {formatNepaliCurrency(Math.max(0, totalAmount - discount))}
                </p>

              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-4 flex justify-end gap-3 bg-white">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#009966] text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving…" : "Save Sale"}
          </Button>
        </div>
      </aside>
    </>
  );
}
