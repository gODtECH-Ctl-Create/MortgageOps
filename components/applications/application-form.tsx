"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateMortgageApplicationSchema, type CreateMortgageApplicationInput } from "@mortgageops/schemas";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const FormSchema = CreateMortgageApplicationSchema.extend({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email(),
  phone: z.string().min(8, "Enter a valid phone number"),
  productId: z.uuid(),
  requestedAmount: z.coerce.number().positive("Enter a mortgage amount greater than zero"),
  tenureMonths: z.coerce.number().int().positive(),
});

type FormValues = z.infer<typeof FormSchema>;

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-red-600">{message}</p> : null;
}

export function ApplicationForm() {
  const mutation = useMutation({
    mutationFn: async (input: CreateMortgageApplicationInput) => {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Unable to create application");
      }

      return response.json() as Promise<{ data: { applicationId: string } }>;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      customerId: "00000000-0000-0000-0000-000000000001",
      productId: "00000000-0000-0000-0000-000000000002",
      requestedAmount: 0,
      tenureMonths: 180,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const payload: CreateMortgageApplicationInput = {
      customerId: values.customerId,
      productId: values.productId,
      requestedAmount: values.requestedAmount,
      tenureMonths: values.tenureMonths,
    };

    await mutation.mutateAsync(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-3">
          <span className="rounded-lg bg-slate-100 p-2"><FileText size={18} /></span>
          <div>
            <h2 className="font-semibold">Applicant</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Create the primary customer record for this mortgage case.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm"><span className="font-medium">First name</span><input {...register("firstName")} className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5" /> <FieldError message={errors.firstName?.message} /></label>
          <label className="space-y-1.5 text-sm"><span className="font-medium">Last name</span><input {...register("lastName")} className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5" /> <FieldError message={errors.lastName?.message} /></label>
          <label className="space-y-1.5 text-sm"><span className="font-medium">Email</span><input type="email" {...register("email")} className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5" /> <FieldError message={errors.email?.message} /></label>
          <label className="space-y-1.5 text-sm"><span className="font-medium">Phone</span><input {...register("phone")} className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5" /> <FieldError message={errors.phone?.message} /></label>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <div className="mb-5"><h2 className="font-semibold">Mortgage request</h2><p className="mt-1 text-sm text-[var(--muted)]">Terms captured here remain subject to credit and underwriting review.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm"><span className="font-medium">Mortgage product</span><select {...register("productId")} className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5"><option value="00000000-0000-0000-0000-000000000002">Home Purchase</option><option value="00000000-0000-0000-0000-000000000003">First Home</option></select></label>
          <label className="space-y-1.5 text-sm"><span className="font-medium">Requested amount (NGN)</span><input type="number" min="0" {...register("requestedAmount")} className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5" /> <FieldError message={errors.requestedAmount?.message} /></label>
          <label className="space-y-1.5 text-sm"><span className="font-medium">Tenure</span><select {...register("tenureMonths", { valueAsNumber: true })} className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5"><option value={120}>10 years</option><option value={180}>15 years</option><option value={240}>20 years</option><option value={300}>25 years</option></select></label>
        </div>
      </section>

      {mutation.isSuccess && <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 size={18} /> Draft application created: {mutation.data.data.applicationId}</div>}
      {mutation.isError && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{mutation.error.message}</div>}

      <div className="flex justify-end">
        <button disabled={isSubmitting || mutation.isPending} type="submit" className="rounded-lg bg-[var(--navy)] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{mutation.isPending ? "Saving…" : "Save draft"}</button>
      </div>
    </form>
  );
}
