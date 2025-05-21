import Link from "next/link";
import { User } from "lucide-react";

const SidePanel = ({ activeTab }) => {
  // Data untuk cultural highlights berdasarkan tab aktif
  const culturalHighlightsByTab = {
    "For You": {
      title: "Judul artikel rekomendasi",
      author: "by nama yg dimiliki",
      description: "deskripsi artikel yang direkomendasikan untuk Anda",
      date: "3 May 2025",
      location: "Bandung",
      image: "/images/gambar.png",
    },
    "All Article": {
      title: "Artikel Terpopuler Minggu Ini",
      author: "by nama yg dimiliki",
      description: "deskripsi artikel yang paling banyak dibaca",
      date: "5 May 2025",
      location: "Jakarta",
      image: "/images/gambar.png",
    },
    "Regional Exploration": {
      title: "Keajaiban Indonesia Timur",
      author: "by nama yg dimiliki",
      description: "deskripsi tentang keindahan alam Indonesia Timur",
      date: "2 May 2025",
      location: "Raja Ampat",
      image: "/images/gambar.png",
    },
    Categories: {
      title: "Panduan Kategori Konten",
      author: "by nama yg dimiliki",
      description: "deskripsi tentang berbagai kategori konten TemuCerita",
      date: "1 May 2025",
      location: "Online",
      image: "/images/gambar.png",
    },
  };

  // Data untuk kategori berdasarkan tab aktif
  const categoriesByTab = {
    "For You": [
      { id: 1, name: "Short Story" },
      { id: 2, name: "Travel" },
      { id: 3, name: "Culture" },
      { id: 4, name: "Technology" },
      { id: 5, name: "Food" },
    ],
    "All Article": [
      { id: 1, name: "Latest" },
      { id: 2, name: "Popular" },
      { id: 3, name: "Editor's Pick" },
      { id: 4, name: "Featured" },
      { id: 5, name: "Trending" },
    ],
    "Regional Exploration": [
      { id: 1, name: "Bali" },
      { id: 2, name: "Java" },
      { id: 3, name: "Sumatra" },
      { id: 4, name: "Sulawesi" },
      { id: 5, name: "Papua" },
    ],
    Categories: [
      { id: 1, name: "Fiction" },
      { id: 2, name: "Non-Fiction" },
      { id: 3, name: "Biography" },
      { id: 4, name: "History" },
      { id: 5, name: "Science" },
    ],
  };

  // Data untuk penulis lokal berdasarkan tab aktif
  const writersByTab = {
    "For You": [
      { id: 1, name: "oleh nama yg dimiliki", followers: "2.4M Followers" },
      { id: 2, name: "oleh nama yg dimiliki", followers: "1.8M Followers" },
      { id: 3, name: "oleh nama yg dimiliki", followers: "1.5M Followers" },
    ],
    "All Article": [
      { id: 1, name: "Penulis Populer 1", followers: "3.2M Followers" },
      { id: 2, name: "Penulis Populer 2", followers: "2.7M Followers" },
      { id: 3, name: "Penulis Populer 3", followers: "1.9M Followers" },
    ],
    "Regional Exploration": [
      { id: 1, name: "Penulis Lokal Bali", followers: "1.4M Followers" },
      { id: 2, name: "Penulis Lokal Jawa", followers: "1.2M Followers" },
      { id: 3, name: "Penulis Lokal Sumatera", followers: "950K Followers" },
    ],
    Categories: [
      { id: 1, name: "Penulis Fiksi", followers: "2.1M Followers" },
      { id: 2, name: "Penulis Non-Fiksi", followers: "1.7M Followers" },
      { id: 3, name: "Penulis Sejarah", followers: "1.3M Followers" },
    ],
  };

  // Memilih data yang sesuai dengan tab aktif
  const currentHighlight =
    culturalHighlightsByTab[activeTab] || culturalHighlightsByTab["For You"];
  const currentCategories =
    categoriesByTab[activeTab] || categoriesByTab["For You"];
  const currentWriters = writersByTab[activeTab] || writersByTab["For You"];

  // Menampilkan hanya 3 kategori terlebih dahulu
  const visibleCategories = currentCategories.slice(0, 3);
  const hasMoreCategories = currentCategories.length > 3;

  return (
    <aside className="w-full md:w-1/4 mt-8 md:mt-0 pl-0 md:pl-4">
      {/* Cultural Highlights */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Cultural Highlights</h3>
        <div className="mb-4">
          <div className="bg-gray-200 h-44 w-full mb-4 rounded relative">
            {/* Placeholder for image */}
          </div>
          <h4 className="font-bold">{currentHighlight.title}</h4>
          <p className="text-sm text-gray-600 flex items-center">
            <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
              <User size={14} />
            </span>
            {currentHighlight.author}
          </p>
          <p className="text-sm text-gray-600">
            {currentHighlight.description}
          </p>
          <p className="text-sm text-gray-600">
            {currentHighlight.location} - {currentHighlight.date}
          </p>
        </div>
        <Link
          href="/cultural-highlights"
          className="text-sm text-gray-600 hover:underline"
        >
          See More
        </Link>
      </div>

      {/* Separator */}
      <div className="border-b border-gray-200 mb-8"></div>

      {/* You may also like */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">You many also like</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.name
                .toLowerCase()
                .replace(" ", "-")}`}
              className="py-2 px-4 bg-gray-50 rounded-lg text-center text-sm text-gray-700 hover:bg-gray-100"
            >
              {category.name}
            </Link>
          ))}
        </div>
        {hasMoreCategories && (
          <button className="text-sm text-gray-600 hover:underline">
            Show {currentCategories.length - visibleCategories.length} more
          </button>
        )}
      </div>

      {/* Separator */}
      <div className="border-b border-gray-200 mb-8"></div>

      {/* Local Writers */}
      <div>
        <h3 className="text-xl font-bold mb-4">Local Writers</h3>
        <div className="space-y-4 mb-4">
          {currentWriters.map((writer) => (
            <div key={writer.id} className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <User size={16} className="text-gray-500" />
              </div>
              <div>
                <p className="font-medium">{writer.name}</p>
                <p className="text-sm text-gray-600">{writer.followers}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="text-sm text-gray-600 hover:underline">
          Show 5 more
        </button>
      </div>
      <div className="border-b border-gray-200 mb-8"></div>
    </aside>
  );
};

export default SidePanel;
