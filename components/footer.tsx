import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 mb-4">© 2025 Prizmora. All rights reserved.</p>

        <div className="flex justify-center space-x-6">
          <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
            Privacy Policy
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
