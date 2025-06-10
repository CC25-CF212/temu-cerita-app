# temuCerita App

Aplikasi web interaktif untuk berbagi dan menemukan cerita-cerita menarik dengan fitur-fitur canggih seperti deteksi wajah, rich text editor, dan visualisasi data.

## 🚀 Fitur Utama

- **Rich Text Editor**: Editor konten canggih dengan dukungan gambar dan link menggunakan TipTap
- **Face Detection**: Deteksi wajah menggunakan teknologi AI untuk fitur interaktif
- **QR Code Scanner**: Kemampuan scan QR code terintegrasi
- **Data Visualization**: Charts dan grafik interaktif dengan Chart.js
- **Authentication**: Sistem login/register yang aman dengan NextAuth
- **Image Upload**: Upload dan manajemen gambar dengan Cloudinary
- **Responsive Design**: Desain yang responsif dengan Tailwind CSS
- **Real-time Notifications**: Notifikasi real-time dengan toast messages
- **Infinite Scroll**: Loading konten yang smooth dengan infinite scroll
- **Social Sharing**: Fitur berbagi ke media sosial

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3** - React framework dengan App Router
- **React 19** - Library JavaScript untuk UI
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Library animasi untuk React
- **Lucide React** - Icon library

### Backend & Database
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **NextAuth** - Authentication solution
- **Cloudinary** - Image hosting dan management

### Specialized Libraries
- **TipTap** - Rich text editor
- **Face-API.js** - Face detection
- **ZXing** - QR code scanning
- **Chart.js** - Data visualization
- **Lottie** - Animation library

## 📦 Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd temu-cerita-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Buat file `.env.local` dan tambahkan:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Setup database**
   ```bash
   npm run db:setup
   ```

5. **Seed data (optional)**
   ```bash
   npm run db:seed
   ```

## 🚀 Getting Started

### Development
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`

### Production
```bash
npm run build
npm start
```

### Database Commands
```bash
# Setup database indexes
npm run db:setup

# Seed initial data
npm run db:seed

# Test database connection
npm run db:test
```

## 📁 Struktur Project

```
temu-cerita-app/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reusable components
│   ├── lib/                 # Utility functions
│   ├── models/              # Database models
│   ├── scripts/             # Database scripts
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── package.json
└── README.md
```

## 🔧 Scripts Available

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server dengan Turbopack |
| `npm run build` | Build aplikasi untuk production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint untuk code quality |
| `npm run db:setup` | Setup database indexes |
| `npm run db:seed` | Seed initial data |
| `npm run db:test` | Test database connection |

## 🎨 Features Detail

### Rich Text Editor
- **TipTap Integration**: Editor yang powerful dengan support untuk berbagai format
- **Image Upload**: Drag & drop image dengan preview
- **Link Management**: Easy link insertion dan editing
- **Placeholder Support**: Helpful placeholder text

### Face Detection
- **AI-Powered**: Menggunakan @vladmandic/face-api untuk deteksi wajah
- **Real-time Processing**: Deteksi wajah secara real-time
- **React Integration**: Seamless integration dengan React hooks

### Data Visualization
- **Chart.js**: Interactive charts dan graphs
- **Responsive Charts**: Charts yang responsive di semua device
- **Multiple Chart Types**: Support untuk berbagai jenis chart

### Authentication
- **NextAuth**: Secure authentication system
- **Multiple Providers**: Support untuk berbagai OAuth providers
- **Session Management**: Automatic session handling

## 🌟 UI/UX Features

- **Framer Motion**: Smooth animations dan transitions
- **Lottie Animations**: Rich animations untuk better UX
- **Toast Notifications**: User-friendly notifications
- **Loading States**: Elegant loading states dengan TopLoader
- **Infinite Scroll**: Smooth content loading
- **Responsive Design**: Mobile-first responsive design

## 🔒 Security Features

- **bcryptjs**: Password hashing
- **Environment Variables**: Secure configuration management
- **Type Safety**: TypeScript untuk type-safe development
- **Input Validation**: Comprehensive input validation

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Check existing issues di GitHub
2. Create new issue dengan detail yang lengkap
3. Atau hubungi tim development

## 🔄 Changelog

### Version 0.1.0
- Initial release
- Basic story sharing functionality
- Face detection integration
- Rich text editor
- Authentication system
- Database setup

---

**temuCerita** - Tempat berbagi dan menemukan cerita-cerita menarik! 🎭📚