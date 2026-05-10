import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

/** Deep links to edit open the modal on the products list. */
export default async function EditProductRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/admin/products?edit=${encodeURIComponent(id)}`);
}
