import { notFound } from "next/navigation";
import { CarForm } from "@/components/admin/CarForm";
import { getCarById, getCarImages } from "@/lib/cars";
import type { Car, CarImage } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function EditCarPage({ params }: { params: Params }) {
  const { id } = await params;
  let car: Car | null = null;
  let images: CarImage[] = [];
  try {
    car = await getCarById(id);
    if (car) images = await getCarImages(id);
  } catch {
    notFound();
  }
  if (!car) notFound();

  return (
    <div>
      <h1 className="text-3xl font-medium tracking-tight mb-8">Edit car</h1>
      <CarForm car={car} images={images} />
    </div>
  );
}
