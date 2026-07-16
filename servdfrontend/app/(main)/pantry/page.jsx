"use client"

import { Package } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddToPantryModal from '@/components/AddToPantryModal'

const Pantrypage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({name: "", quantity: ""});

    const handleModalSuccess = (item) =>(
        setItems([...items, item])
    )

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4" >
            <div className="container mx-auto max-w-5xl">
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Package className="w-16 h-16 mr-5 text-orange-700" />
                            <div >
                                <h1 className='textxl md:text-5xl font-bold text-stone-900 tracking-tight-'>My Pantry</h1>
                                <p className="text-stone-600 font-light ">Mange your ingredients and discover what youb can cook</p>
                            </div>
                        </div>
                        <Button 
                        onClick={()=>setIsModalOpen(true)}
                        className="hidden md:flex mr-50" size="lg">
                            <Plus className="mr-2 w-5 h-5" />
                            Add to Pantry
                        </Button>
                    </div>
                </div>
                {/* Quick Action card - find recipes */}

                {/* loading state */}
                
                {/* pantry itmes grid */}
                
                {/* empty state */}

            </div>
            {/* Add tp pantry modal */}
            <AddToPantryModal
                isOpen={isModalOpen}
                onClose={()=> setIsModalOpen(false)}
                onSuccess={()=>handleModalSuccess}
            />
        </div>
    )
}

export default Pantrypage