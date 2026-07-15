"use client";

import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './ui/dialog'
import { useState } from 'react'
import PrincingSection from './PricingSection'


const PricingModal = ({subscriptionTier= "free", children }) => {

    const [isOpen, setIsOpen] = useState(false);

    const canOpen = subscriptionTier === "free";

    return (
        <Dialog open={isOpen} onOpenChange={canOpen ? setIsOpen : undefined}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="p-8 pt-4 sm:max-w-4xl">
                <DialogTitle />
                <PrincingSection />
            </DialogContent>
        </Dialog>
    )
}

export default PricingModal
