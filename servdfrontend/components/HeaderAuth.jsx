'use client'

import { SignInButton, SignUpButton, Show} from '@clerk/nextjs'
import { Button } from './ui/button'
import { Sparkles } from 'lucide-react'
import UserDropdown from './UserDropdown'
import PricingModal from './PricingModal'
import { Badge } from './ui/badge'

const HeaderAuth = ({ user }) => {
  return (
    <div className="flex items-center space-x-4">
      <Show when={'signed-in'}>
        {user && (
          <PricingModal subscriptionTier={user.subscriptionTier}>
            <Badge
              variant="outline"
              className={`flex h-8 px-3 gap-1.5 rounded-full text-xs font-semibold transition-all ${
                user.subscriptionTier === "pro"
                  ? "bg-linear-to-r from-orange-600 to-amber-500 text-white border-none shadow-sm"
                  : "bg-stone-200/50 text-stone-600 border-stone-200 cursor-pointer hover:bg-stone-300/50 hover:border-stone-300"
              }`}
            >
              <Sparkles
                className={`h-3 w-3 ${
                  user.subscriptionTier === "pro" ? "text-white fill-white/20" : "text-stone-500"
                }`}
              />
              <span>{user.subscriptionTier === "pro" ? "Pro Chef" : "Free Plan"}</span>
            </Badge>
          </PricingModal>
        )}
        <UserDropdown />
      </Show>

      <Show when={'signed-out'}>
        <SignInButton mode="modal">
          <Button variant="ghost" className="text-stone-600 hover:text-orange-600 hover:bg-orange-50 font-medium">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="primary" className="rounded-full px-6">
            Get Started
          </Button>
        </SignUpButton>
      </Show>
    </div>
  )
}

export default HeaderAuth