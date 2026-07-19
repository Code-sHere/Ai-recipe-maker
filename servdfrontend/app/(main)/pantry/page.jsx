"use client"

import { Package } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddToPantryModal from '@/components/AddToPantryModal'
import useFetch from '@/hooks/use-fetch'
import { deletePantryItem, getPantryItems, UpdatePantryItem } from '@/actions/pantry.actions'
import PricingModal from '@/components/PricingModal'

const Pantrypage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({name: "", quantity: ""});

    // fetching the items
    const {loading: loadingItems,
        data: itemsData,
        fetchData: fetchItems,
    } = useFetch(getPantryItems);

    // deleting the items
    const {loading: deleting,
        data: deleteData,
        fetchData: deleteItem,
    } = useFetch(deletePantryItem);

    // updating the items
    const {
        loading: updating,
        data: updateData,
        fetchData: updateItem,
    } = useFetch(UpdatePantryItem);

    //load itmes on mount
    useEffect(()=>{
        fetchItems();
    }, []);

    useEffect(()=>{
        if(itemsData?.success){
            setItems(itemsData.items);
        }
    },[itemsData]);

    useEffect(()=>{
        if(deleteData?.success){
            fetchItems();
        }
    },[deleteData]);

    const handleModalSuccess = () =>{};

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
                    {itemsData?.scansLimit !== undefined && (
                            <div className="bg-white py-3 px-4 border-2 border-stone-200 inline-flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-orange-600" />
                                <div className="text-sm">
                                    {
                                        itemsData.scansLimit === "unlimited" ? (<>
                                            <span className="font-bold text-green-600">∞</span>
                                            <span classname="text-stone-500">{" "}Unlimited AI Scans (pro Plan)</span> 
                                        </>): (
                                            <PricingModal>
                                                <span className="text-stone-500 cursor-pointer"> Upgrade to Pro for unlimited pantry scans</span>
                                            </PricingModal>
                                        )
                                    }
                                </div>
                            </div>
                        )}
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