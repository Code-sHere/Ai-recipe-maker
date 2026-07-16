"use client"

import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'

const AddToPantryModal = ({isOpen, onClose, onSuccess}) => {


    const [activeTab, setActiveTab] = useState("scan");

    const [selectImage, setSelectImage] = useState(null);

    const [scannedIngredients, setScannedIngredients] = useState([]);

    const [manualItem, setManualItem] = useState({name:"", quntity:""});

    const handleClose = () => {
        setActiveTab("scan");
        setSelectImage(null);
        setScannedIngredients([]);
        setManualItem({name:"", quntity:""});
        onClose();
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
            </DialogContent>
        </Dialog>
    )
}

export default AddToPantryModal
