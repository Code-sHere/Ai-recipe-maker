import React from 'react'
import Link from 'next/link'
import { Cookie, Refrigerator } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'
import HeaderAuth from './HeaderAuth'

const Header = async () => {
  const user = await checkUser()

  return (
    <div>
      <header className="flex top-0 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur-md z-50 supports-filter:bg-stone-50/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"}>Logo</Link>

          <div className="flex justify-between items-center gap-4">
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-600">
              <Link href="/recipes" className="hover:text-orange-600 transitio-colors flex gap-1.5 items-center">
                <Cookie className="w-4 h-4" />My Recipes
              </Link>
              <Link href="/pantry" className="hover:text-orange-600 transitio-colors flex gap-1.5 items-center">
                <Refrigerator className="w-4 h-4" />My Pantry
              </Link>
            </div>

            <HeaderAuth user={user} />
          </div>
        </nav>
      </header>
    </div>
  )
}

export default Header