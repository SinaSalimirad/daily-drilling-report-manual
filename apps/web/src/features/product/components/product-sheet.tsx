"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useCan } from "@/features/auth/hooks/use-auth";
import { useCreateProduct } from "../hooks/use-product";
import { useProductForm } from "../hooks/use-product-form";
import { type ProductFormValues, toPayload } from "../lib/product-form";
import { ProductFormSheet } from "./product-form-sheet";

export function ProductSheet() {
  const [open, setOpen] = useState(false);
  // The API only lets a manager (or higher) add one; below that there is no button to show.
  const canAdd = useCan("manager");
  const { mutateAsync: createProduct } = useCreateProduct();

  const form = useProductForm(async (values: ProductFormValues) => {
    try {
      await createProduct(toPayload(values));
    } catch {
      // The hook shows the error as a toast; keep the sheet open so nothing typed is lost.
      return false;
    }

    setOpen(false);
    return true;
  });

  if (!canAdd) return null;

  return (
    <ProductFormSheet
      form={form}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
      title="Add New Product"
      submitLabel="Add Product"
      submittingLabel="Adding..."
      trigger={
        <>
          <Plus className="size-4" />
          Add Product
        </>
      }
    />
  );
}
