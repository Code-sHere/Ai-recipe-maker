import { SignInButton, SignUpButton } from '@clerk/nextjs'

import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import {Cookie, Refrigerator, Sparkles } from 'lucide-react'
import UserDropdown from './UserDropdown'
import PricingModal from './PricingModal'
import { checkUser } from '@/lib/checkUser'
import { Badge } from './ui/badge'


const Header = async () => {
  const user = await checkUser();

  return (
    <div>
      <header className="flex top-0 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur-md z-50 supports-filter:bg-stone-50/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"}>Logo</Link>

          <div className="flex justify-between items-center gap-4">
            <div className="hidden md:flex  items-center space-x-8 text-sm font-medium text-stone-600">
              <Link href="/recipes"
                className="hover:text-orange-600 transitio-colors flex gap-1.5 items-center">
                <Cookie className="w-4 h-4" />My Recipes
              </Link>

              <Link href="/pantry"
                className="hover:text-orange-600 transitio-colors flex gap-1.5 items-center">
                <Refrigerator className="w-4 h-4" />My Pantry
              </Link>

            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <PricingModal subscriptionTier={user.subscriptionTier}>
                    <Badge
                      variant="outline"
                      className={`flex h-8 px-3 gap-1.5 rounded-full text-xs font-semibold transition-all ${user.subscriptionTier === "pro"
                          ? "bg-liner-to-r from-orange-600 to-amber-500 text-white"
                          : "bg-stone-200/50 text-stone-600 border-stone-200 cursor-pointer hover:bg-stone-300/50 hover:border-stone-300"
                        }`}
                    >
                      <Sparkles
                        className={`h-3 w-3 ${user.subscriptionTier === "pro" ? "text-white fill-white/20" : "text-stone-500"
                          }`}
                      /> <span>{user.subscriptionTier === "pro" ? "Pro Plan" : "Free Plan"}</span>
                    </Badge>
                  </PricingModal>
                  <UserDropdown />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      className="text-stone-600 hover:text-orange-700 hover:bg-orange-50 font-medium"
                    >
                      Sign In
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <Button variant="primary" className="rounded-full px-6">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>

        </nav>
      </header>
    </div>
  )
}

export default Header

