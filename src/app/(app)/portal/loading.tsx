export default function PortalLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-line border-t-brand" />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  );
}
