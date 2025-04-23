import { Link } from "react-router-dom"
import MainLayout from "../components/layout/main-layout"

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Sayfa Bulunamadı</h2>
        <p className="text-muted-foreground mb-6">Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.</p>
        <Link
          to="/"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </MainLayout>
  )
}
