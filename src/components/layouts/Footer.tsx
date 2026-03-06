import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold text-red-500 mb-4 block">
              Aurora Dil Eğitim Merkezi
            </span>
            <p className="text-gray-300 mb-4 max-w-md">
              Profesyonel eğitmenlerle online Almanca öğrenin. A1`den C2`ye kadar
              tüm seviyeler için kapsamlı eğitim programları sunuyoruz.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer" />
              <Instagram className="w-6 h-6 text-red-400 hover:text-red-300 cursor-pointer" />
              <Youtube className="w-6 h-6 text-red-500 hover:text-red-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-lg font-semibold mb-4 block text-yellow-400">
              Hızlı Linkler
            </span>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Kurslar
                </Link>
              </li>
              <li>
                <Link
                  href="/translation"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tercümanlık
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  İletişim
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <span className="text-lg font-semibold mb-4 block text-yellow-400">
              İletişim
            </span>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">
                  info@auroradil.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+90 546 207 19 48</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Ankara, Türkiye</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Aurora Dil Eğitim Merkezi. <a href="https://www.sembyweb.com" className="text-yellow-400">SembyWeb</a> tarafından hazırlanmıştır.
            Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;