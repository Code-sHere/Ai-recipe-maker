import { Package } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const Pantrypage = () => {
    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-15 px-4" >
            <div className="container mx-auto max-w-5xl">
                <div className="mb-4">
                    <div className="flex items-center justify-start mb-6">
                        <Package className="w-16 h-16 mr-5 text-orange-700" />
                        <div >
                            <h1 className='textxl md:text-5xl font-bold text-stone-900 tracking-tight-'>My Pantry</h1>
                            <p className="text-stone-600 font-light ">Mange your ingredients and discover what youb can cook</p>
                        </div>
                        <Button className="hidden md:flex mr-50" size="lg">
                        <Plus className="mr-2 w-5 h-5" />
                        Add to Pantry
                    </Button>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Pantrypage