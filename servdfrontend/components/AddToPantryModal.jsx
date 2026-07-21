"use client"

import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Plus } from 'lucide-react'
import { Camera } from 'lucide-react'
import useFetch from '@/hooks/use-fetch'


const AddToPantryModal = ({ isOpen, onClose, onSuccess }) => {


    const [activeTab, setActiveTab] = useState("scan");

    const [selectImage, setSelectImage] = useState(null);

    const [scannedIngredients, setScannedIngredients] = useState([]);

    const [manualItem, setManualItem] = useState({ name: "", quntity: "" });

    const {
        loading: scanning,
        data: scanData,
        fetchData: scanImage,
    } = useFetch(scanPantryItem);

    const {
        loading: saving,
        data: saveData,
        fetchData: saveSacnnedItem,
    } = useFetch(saveToPantry);

    const {
        loading: adding,
        data: addData,
        fetchData: addManualItem,
    } = useFetch(addToPantryItemManually);


    const handleClose = () => {
        setActiveTab("scan");
        setSelectImage(null);
        setScannedIngredients([]);
        setManualItem({ name: "", quntity: "" });
        onClose();
    }

    const handleAddManual = ()=>{
        setActiveTab("manually");
        setManualItem({ name: "", quntity: "" });

    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>

                <Tabs Value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="scan" className="gap-2">
                            <Camera className="w-4 h-4" />
                            AI Scan
                        </TabsTrigger>
                        <TabsTrigger value="manually" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Manually
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="scan" className="space-y-6 mt-6">Scan an image of your fridge.</TabsContent>
                    <TabsContent value="manually" className="mt-6"><form onSubmit={handleAddManual} className="space-y-6">
                        <div>
                            <label classname="block text-sm font-medium text-stone-700 mb-2">Ingredient Name</label>
                            <input 
                            type="text"
                            valu={manualItem.name}
                            onChange={(e)=> setManualItem({...manualItem, name: e.target.value})}
                            placeholder='e.g., Dal Makhini'
                            className='w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600'
                            diabled={adding}
                            />
                        </div> 

                        <div>
                            <label className='block text-sm font-medium text-stone-700 mb-2'>Quantity</label>
                            <input 
                            type="text"
                            valu={manualItem.quntity}
                            onChange={(e)=> setManualItem({...manualItem, quntity: e.target.value})}
                            placeholder='e.g., 1 cup'
                            className='w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600'
                            diabled={adding}
                            />
                        </div>   
                    </form></TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default AddToPantryModal
