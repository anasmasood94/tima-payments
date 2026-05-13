export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-b from-brand/5 via-white to-white px-4 py-6 sm:px-10 sm:py-8 lg:px-20 lg:py-10">
      {children}
    </div>
  );
}
