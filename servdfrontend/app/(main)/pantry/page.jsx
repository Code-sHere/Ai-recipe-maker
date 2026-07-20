"use client"

import { Badge, Loader2, Package } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddToPantryModal from '@/components/AddToPantryModal'
import useFetch from '@/hooks/use-fetch'
import { deletePantryItem, getPantryItems, UpdatePantryItem } from '@/actions/pantry.actions'
import PricingModal from '@/components/PricingModal'
import {Sparkles} from 'lucide-react'
import Link from 'next/link'


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

                {items.length > 0 && <Link herf="{/pantry/recipes" className="block mb-8">
                    <div classname="bg-liner-to-br from-green-600 to-emerald-500 text-white p-6 border-2 border-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all coursor-pointer rounded-3xl">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 border-2 border-white/30 group-hover:bg-white/30 transition-colors">
                                <ChefHat className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl mb-1">
                                    What Can I Cook Today? 
                                </h3>
                                <p>
                                    Get AI-powered recipe suggestions from your {items.length}{" "}ingredients
                                </p>
                            </div>
                            <div className="hidden sm:block">
                                <Badge className="bg-white/20 text-white border-2 border-white/30 font-bold uppercase rounded-full tracking-wide">
                                    {items.length} items
                                </Badge>
                            </div>
                        </div>
                    </div>
                </Link>}

                {/* loading state */}

                {loadingItems &&(
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                        <p classname="text-stone-500">Loading your Pantry....</p>
                    </div>
                )}
                
                {/* pantry itmes grid */}

                {!loadingItems && items.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl fot-bold text-stone-900">
                                Your Ingredients
                            </h2>
                            <Badge 
                                variant="outline"
                                className="text-stone-600 border-2 border-stone-900 font-bold uppercase tracking-wide"
                            >
                                {items.length} {items.length === 1 ? "item" : "items"}
                            </Badge>
                        </div>
                    </div>
                )}
                
                {/* empty state */}
                {!loadingItems && items.length === 0 && (
                    <div classname="bg-white p-12 text-center border-2 border-dashed border-stone-200">
                        <div className="bg-orange-100 w-20 h-20 border-2 border-orange-200 flex itmes-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-orange-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900" mb-2>
                            Your Pantry is Empty
                        </h3>
                    </div>
                )}

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