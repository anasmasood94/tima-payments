export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-b from-brand/5 via-white to-white px-20 py-10">
      {children}
    </div>
  );
}
