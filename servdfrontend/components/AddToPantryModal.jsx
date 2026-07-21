"use client"

import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Plus } from 'lucide-react'
import { Camera } from 'lucide-react'


const AddToPantryModal = ({ isOpen, onClose, onSuccess }) => {


    const [activeTab, setActiveTab] = useState("scan");

    const [selectImage, setSelectImage] = useState(null);

    const [scannedIngredients, setScannedIngredients] = useState([]);

    const [manualItem, setManualItem] = useState({ name: "", quntity: "" });

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
                        </div>    
                    </form></TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default AddToPantryModal
