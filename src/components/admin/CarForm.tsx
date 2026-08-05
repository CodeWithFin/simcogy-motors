"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Car, CarImage } from "@/lib/types";

type Props = {
  car?: Car;
  images?: CarImage[];
};

const empty = {
  make: "",
  model: "",
  trim: "",
  year: new Date().getFullYear(),
  vin: "",
  body_type: "",
  transmission: "automatic",
  fuel_type: "petrol",
  drivetrain: "fwd",
  engine_capacity_cc: "",
  mileage_km: 0,
  color: "",
  seats: "",
  condition: "used",
  import_type: "foreign_used",
  price: "",
  negotiable: true,
  previous_price: "",
  status: "draft",
  featured: false,
  description: "",
};

export function CarForm({ car, images = [] }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    make: car?.make ?? empty.make,
    model: car?.model ?? empty.model,
    trim: car?.trim ?? empty.trim,
    year: car?.year ?? empty.year,
    vin: car?.vin ?? empty.vin,
    body_type: car?.body_type ?? empty.body_type,
    transmission: car?.transmission ?? empty.transmission,
    fuel_type: car?.fuel_type ?? empty.fuel_type,
    drivetrain: car?.drivetrain ?? empty.drivetrain,
    engine_capacity_cc: car?.engine_capacity_cc?.toString() ?? "",
    mileage_km: car?.mileage_km ?? 0,
    color: car?.color ?? empty.color,
    seats: car?.seats?.toString() ?? "",
    condition: car?.condition ?? empty.condition,
    import_type: car?.import_type ?? empty.import_type,
    price: car?.price ?? "",
    negotiable: car?.negotiable ?? true,
    previous_price: car?.previous_price ?? "",
    status: car?.status ?? "draft",
    featured: car?.featured ?? false,
    description: car?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [localImages, setLocalImages] = useState(images);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        engine_capacity_cc: form.engine_capacity_cc
          ? Number(form.engine_capacity_cc)
          : null,
        seats: form.seats ? Number(form.seats) : null,
        price: Number(form.price),
        previous_price: form.previous_price
          ? Number(form.previous_price)
          : null,
        mileage_km: Number(form.mileage_km),
        year: Number(form.year),
      };

      const res = await fetch(car ? `/api/admin/cars/${car.id}` : "/api/admin/cars", {
        method: car ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push(`/admin/cars/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length || !car) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        body.append("carId", car.id);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setLocalImages((imgs) => [...imgs, data.image]);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function setCover(imageId: string) {
    if (!car) return;
    await fetch(`/api/admin/cars/${car.id}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId, action: "cover" }),
    });
    setLocalImages((imgs) =>
      imgs.map((i) => ({ ...i, is_cover: i.id === imageId }))
    );
    router.refresh();
  }

  async function deleteImage(imageId: string) {
    if (!car) return;
    await fetch(`/api/admin/cars/${car.id}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId, action: "delete" }),
    });
    setLocalImages((imgs) => imgs.filter((i) => i.id !== imageId));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Make">
          <input required className="field" value={form.make} onChange={(e) => set("make", e.target.value)} />
        </Field>
        <Field label="Model">
          <input required className="field" value={form.model} onChange={(e) => set("model", e.target.value)} />
        </Field>
        <Field label="Trim">
          <input className="field" value={form.trim} onChange={(e) => set("trim", e.target.value)} />
        </Field>
        <Field label="Year">
          <input required type="number" className="field" value={form.year} onChange={(e) => set("year", Number(e.target.value))} />
        </Field>
        <Field label="Price (KES)">
          <input required type="number" className="field" value={form.price} onChange={(e) => set("price", e.target.value)} />
        </Field>
        <Field label="Previous price">
          <input type="number" className="field" value={form.previous_price} onChange={(e) => set("previous_price", e.target.value)} />
        </Field>
        <Field label="Mileage (km)">
          <input required type="number" className="field" value={form.mileage_km} onChange={(e) => set("mileage_km", Number(e.target.value))} />
        </Field>
        <Field label="VIN">
          <input className="field" value={form.vin} onChange={(e) => set("vin", e.target.value)} />
        </Field>
        <Field label="Body type">
          <input className="field" placeholder="suv, sedan..." value={form.body_type} onChange={(e) => set("body_type", e.target.value)} />
        </Field>
        <Field label="Color">
          <input className="field" value={form.color} onChange={(e) => set("color", e.target.value)} />
        </Field>
        <Field label="Transmission">
          <select className="field" value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
            <option value="cvt">CVT</option>
          </select>
        </Field>
        <Field label="Fuel">
          <select className="field" value={form.fuel_type} onChange={(e) => set("fuel_type", e.target.value)}>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
        </Field>
        <Field label="Drivetrain">
          <select className="field" value={form.drivetrain} onChange={(e) => set("drivetrain", e.target.value)}>
            <option value="fwd">FWD</option>
            <option value="rwd">RWD</option>
            <option value="awd">AWD</option>
            <option value="4wd">4WD</option>
          </select>
        </Field>
        <Field label="Engine (cc)">
          <input type="number" className="field" value={form.engine_capacity_cc} onChange={(e) => set("engine_capacity_cc", e.target.value)} />
        </Field>
        <Field label="Seats">
          <input type="number" className="field" value={form.seats} onChange={(e) => set("seats", e.target.value)} />
        </Field>
        <Field label="Condition">
          <select className="field" value={form.condition} onChange={(e) => set("condition", e.target.value)}>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="certified_preowned">Certified</option>
          </select>
        </Field>
        <Field label="Import type">
          <select className="field" value={form.import_type} onChange={(e) => set("import_type", e.target.value)}>
            <option value="locally_used">Locally used</option>
            <option value="foreign_used">Foreign used</option>
            <option value="brand_new">Brand new</option>
          </select>
        </Field>
        <Field label="Status">
          <select className="field" value={form.status} onChange={(e) => set("status", e.target.value as typeof form.status)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-3 text-sm font-light">
        <input type="checkbox" checked={form.negotiable} onChange={(e) => set("negotiable", e.target.checked)} />
        Negotiable
      </label>
      <label className="flex items-center gap-3 text-sm font-light">
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
        Featured
      </label>

      <Field label="Description">
        <textarea
          rows={5}
          className="field resize-y"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      {car && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Photos</p>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => onUpload(e.target.files)}
            className="text-sm text-muted-foreground"
          />
          {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {localImages.map((img) => (
              <div key={img.id} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-2 flex gap-1 bg-black/60">
                  <button type="button" onClick={() => setCover(img.id)} className="text-[10px] px-2 py-1 rounded bg-accent text-accent-foreground">
                    {img.is_cover ? "Cover" : "Set cover"}
                  </button>
                  <button type="button" onClick={() => deleteImage(img.id)} className="text-[10px] px-2 py-1 rounded bg-muted text-foreground">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!process.env.NEXT_PUBLIC_IMAGEKIT_READY && localImages.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Set IMAGEKIT_URL_ENDPOINT in .env to enable uploads.
            </p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="px-8 py-3 rounded-full bg-accent text-accent-foreground font-medium disabled:opacity-60"
      >
        {saving ? "Saving…" : car ? "Save changes" : "Create car"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground font-light">{label}</span>
      {children}
    </label>
  );
}
