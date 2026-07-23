"use client"

import { Badge, Check, Edit2, Loader2, Package, Trash2, X, ChefHat } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddToPantryModal from '@/components/AddToPantryModal'
import useFetch from '@/hooks/use-fetch'
import { deletePantryItem, getPantryItems, UpdatePantryItem } from '@/actions/pantry.actions'
import PricingModal from '@/components/PricingModal'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'


const Pantrypage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({ name: "", quantity: "" });

    // fetching the items
    const { loading: loadingItems,
        data: itemsData,
        fetchData: fetchItems,
    } = useFetch(getPantryItems);

    // deleting the items
    const { loading: deleting,
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
    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (itemsData?.success) {
            toast.success("Items fetched successfully");
            setItems(itemsData.items);
        }
    }, [itemsData]);

    useEffect(() => {
        if (deleteData?.success && !deleting) {
            toast.success("Item removed from pantry");
            fetchItems();
        }
    }, [deleteData]);

    useEffect(()=>{
        if(updateData?.success){
            toast.success("Item updated successfully");
            setEditingId(null);
            fetchItems();
        }
    },[updateData])

    const handleDelete = async(itemId) => {
        const formData = new FormData();
        formData.append("itemId", itemId);
        await deleteItem(formData);
    };

    const startEdit = (item) =>{
        setEditingId(item.documentId);
        setEditValues({
            name: item.name,
            quantity: item.quantity
        })
    }

    const saveEdit = async () =>{
        const formData = new FormData();
        formData.append("itemId", editingId);
        formData.append("name", editValues.name);
        formData.append("quantity", editValues.quantity);
        await updateItem(formData);
    }

    const cancelEdit = () =>{
        setEditingId(null);
        setEditValues({ name: "", quantity: "" });
    }

    const handleModalSuccess = () => { 
        fetchItems();
    };

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
                            onClick={() => setIsModalOpen(true)}
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
                                        <span className="text-stone-500">{" "}Unlimited AI Scans (pro Plan)</span>
                                    </>) : (
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

                {items.length > 0 && <Link href="/pantry/recipes" className="block mb-8">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-500 text-white p-6 border-2 border-emerald-700 hover:shadow-xl hover:-translate-y-1 transition-all coursor-pointer rounded-3xl">
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

                {loadingItems && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                        <p className="text-stone-500">Loading your Pantry....</p>
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
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item) => (
                                <div key={item.documentId}
                                    className="bg-white p-5 border-2 border-stone-200 hover:border-orange-600 hover:shadow-lg transition-all">
                                    {editingId === item.documentId ? <div className="space-y-3">
                                        <input type="text" 
                                            value={editValues.name}
                                            onChange={(e)=>{
                                                setEditValues({
                                                    ...editValues, name: e.target.value
                                                })
                                            }}
                                            className="w-full px-3 py-2 border-2 border-stone-200 focus:outline-none focus:border-orange-600 text-sm"
                                            placeholder="Ingredient Name"
                                        />

                                        <input type="text" 
                                            value={editValues.quantity}
                                            onChange={(e)=>{
                                                setEditValues({
                                                    ...editValues, quantity: e.target.value
                                                })
                                            }}
                                            className="w-full px-3 py-2 border-2 border-stone-200 focus:outline-none focus:border-orange-600 text-sm"
                                            placeholder="Ingredient Name"
                                        />

                                        <div className="flex gap-2">

                                            <Button
                                                size="sm"
                                                onClick={saveEdit}
                                                disabled={updating}
                                                className="flex-1 bg-green-600 hover:bg-green-700 border-2 border-green-700"
                                            >
                                                {updating ? (<Loader2 className="w-4 h-4 animate-spin" />) : 
                                                (
                                                    <Check className="w-4 h-4" />
                                                )
                                                }
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={updating}
                                                className="flex-1  
                                                border-2 border-stone-900 hover:bg-stone-900
                                                hover:text-white hover:border-stone-900"
                                            >
                                                <X className='w-4 h-4' />
                                            </Button>
                                        </div>

                                    </div> : <div className=" flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-stone-900 mb-1 ">
                                                {item.name}
                                            </h3>
                                            <p className="text-stone-500 text-sm font-light">{item.quantity}</p>
                                            <button
                                                onClick={() => startEdit(item)}
                                                className="p-2 border-2 border-transparent hover:border-orange-600 hover:bg-orange-50 transition-all text-stone-600 hover:text-orange-600">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.documentId)}
                                                className='p-2 border-2 border-transparent hover:border-red-600 hover:bg-orange-50 transition-all text-stone-600 hover:text-red-600'>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xs text-stone-400">
                                            Added {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* empty state */}
                {!loadingItems && items.length === 0 && (
                    <div className=" bg-white p-12 text-center border-2 border-dashed border-stone-200">
                        <div className="bg-orange-100 w-20 h-20 border-2 border-orange-200 flex itmes-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-20 text-orange-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-2 mt-5 md:text-3xl">
                            Your Pantry is Empty
                        </h3>
                    </div>
                )}

            </div>
            {/* Add tp pantry modal */}
            <AddToPantryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => handleModalSuccess}
            />
        </div>
    )
}

export default Pantrypage