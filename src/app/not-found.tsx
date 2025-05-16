// app/not-found.tsx

export default function NotFound() {
  return (
    <div className="text-center mt-20" data-is404="true">
      <h1 className="text-4xl font-bold">404 - Halaman Tidak Ditemukan</h1>
      <p className="mt-2 text-gray-600">URL yang kamu cari tidak tersedia.</p>
    </div>
  );
}
