"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Custom404() {
  const pathname = usePathname()

  const renderNotFoundContent = () => {
    
    if (pathname.startsWith('/dashboard')) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
          <Image src="/not-found.svg" width={400} height={400} alt="Admin not found image" className="animate-bounce" />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">Admin Page Not Found</h1>
          <p className="mt-2 text-lg text-gray-600">Sorry, the admin page you are looking for does not exist.</p>
          <Link href="/dashboard" className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-gray-600">
            Return to Dashboard
          </Link>
        </div>
      )
    }

    // Default Not Found Page
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
        <Image src="/not-found.svg" width={400} height={400} alt="Not found image" className="animate-bounce" />
        <h1 className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</h1>
        <p className="mt-2 text-lg text-gray-600">Sorry, the page you are looking for does not exist.</p>
        <Link href="/" className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-gray-600">
          Return to Home
        </Link>
      </div>
    )
  }

  return renderNotFoundContent()
}