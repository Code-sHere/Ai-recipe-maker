"use client"

import React, { useState, useEffect} from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Loader2, Plus } from 'lucide-react'
import { Camera } from 'lucide-react'
import useFetch from '@/hooks/use-fetch'
import { addPantryItemManually, scanPantryImage, saveToPantry } from '@/actions/pantry.actions'
import { toast } from 'sonner'
import { Button } from './ui/button'
import ImageUploader from './ImageUploader'


const AddToPantryModal = ({ isOpen, onClose, onSuccess }) => {


    const [activeTab, setActiveTab] = useState("scan");

    const [selectImage, setSelectImage] = useState(null);

    const [scannedIngredients, setScannedIngredients] = useState([]);

    const [manualItem, setManualItem] = useState({ name: "", quantity: "" });

    // scanning the image
    const {
        loading: scanning,
        data: scanData,
        fetchData: scanImage,
    } = useFetch(scanPantryImage);

    //updating scanned items
    useEffect(()=>{
        if(scanData?.success && scanData?.ingredients){
            setScannedIngredients(scanData.ingredients);
            toast.success(`Found ${scanData.ingredients.length} ingredients`);
        }
    },[scanData]);

    const {
        loading: saving,
        data: saveData,
        fetchData: saveSacnnedItem,
    } = useFetch(saveToPantry);

    const {
        loading: adding,
        data: addData,
        fetchData: addManualItem,
    } = useFetch(addPantryItemManually);

    useEffect(()=>{
        if(addData?.success){
            toast.success("Item added to your pantry");
            setManualItem({ name: "", quantity: "" });
            handleClose();
            if (onSuccess)onSuccess();
        }
    },[addData]);


    const handleClose = () => {
        setActiveTab("scan");
        setSelectImage(null);
        setScannedIngredients([]);
        setManualItem({ name: "", quantity: "" });
        onClose();
    }

    const handleImageSelect = (file) => {
        setSelectImage(file);
        setScannedIngredients([]);
    }

    const handleAddManual = async (e)=>{
        e.preventDefault();
        if(!manualItem.name.trim() || !manualItem.quantity.trim()){
            toast.error("Please enter a name and quantity");
            return};
        const formData = new FormData();
        formData.append("name", manualItem.name.trim());
        formData.append("quantity", manualItem.quantity.trim());
        await addManualItem(formData);
    }

    const handleScan = async (e)=>{
        e.preventDefault();
        if(!selectImage){
            toast.error("Please select an image");
            return;
        }
        const formData = new FormData();
        formData.append("image", selectImage);
        await scanImage(formData);
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

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
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
                    <TabsContent value="scan" className="space-y-6 mt-6">   {scannedIngredients.length === 0 ? <div className="space-y-6 mt-6">
                        <ImageUploader 
                            onImageSelect={handleImageSelect}
                            loading={scanning}
                        />

                        {selectImage && !scanning && (
                            <Button onClick={handleScan} 
                            variant='primary'
                            className="w-full bg-orange-700 text-white h-12 text-lg" disabled={scanning}>
                                {scanning ? (
                                    <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin"/>Analyzing...
                                    </>
                                ):(
                                    <>
                                    <Camera className="w-5 h-5 mr-2"/>Scan Image
                                    </>
                                )}
                            </Button>
                        )}
                    </div> : <div></div> }  
                    </TabsContent>
                    <TabsContent value="manually" className="mt-6"><form onSubmit={handleAddManual} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">Ingredient Name</label>
                            <input 
                            type="text"
                            value={manualItem.name}
                            onChange={(e)=> setManualItem({...manualItem, name: e.target.value})}
                            placeholder='e.g., Dal Makhini'
                            className='w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600'
                            disabled={adding}
                            />
                        </div> 

                        <div>
                            <label className='block text-sm font-medium text-stone-700 mb-2'>Quantity</label>
                            <input 
                            type="text"
                            value={manualItem.quantity}
                            onChange={(e)=> setManualItem({...manualItem, quantity: e.target.value})}
                            placeholder='e.g., 1 cup'
                            className='w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600'
                            disabled={adding}
                            />
                        </div> 

                        <Button type="submit"
                        disabled={adding}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12 w-full">
                            {adding ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Addding....</>) : (<>
                            <Plus w-5 h-5 mr-2/>Add Item
                            </>)
                            }
                        </Button>  
                    </form>
                </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default AddToPantryModal
