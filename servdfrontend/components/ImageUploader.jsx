"use client";

import { Camera, ImageIcon, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { RingLoader } from "react-spinners";



const ImageUploader = ({ onImageSelect, loading }) => {

    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        onImageSelect(file);
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive, open
    } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpg", ".jpeg", ".png", ".webp"]
        },
        maxFiles: 1,
        maxSize: 10485760,
        noClick: true,
        noKeyboard: true,
    });

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        onDrop([file]);
    }

    const clearImage = () => {
        setPreview(null);
        onImageSelect(null);
        if(fileInputRef.current){
            fileInputRef.current.value = null;
        }
    }

    if (preview) {
        return <div className="relative w-full aspect-video bg-stone-100 rounded-2xl overflow-hidden border-2 border-stone-200">
            <img src={preview} alt="preview" fill className="object-cover" />
            {!loading && (
                <button onClick={clearImage}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                >
                    <X className="w-5 h-5 text-stone-800" />
                </button>
            )}
            {loading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <RingLoader color=" white" />
                </div>
            )}
        </div>;


    }

    return (
        <>
            <div {...getRootProps()} className={`relative w-full aspect-square border-2 border-dashed border-stone-200 rounded-3xl transition-all cursor-pointer ${isDragActive ? "border-orange-600 bg-orange-50 scale-[1.02" : "border-stone-300 bg-stone-50 hover:border-orange-600 hover:bg-orange-50/50"
                }`}>
                <input {...getInputProps()} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 teext-center">
                    {isDragActive ? (<ImageIcon className="w-15 h-15 p-4 border transition-colors rounded-full hover:text-orange-600 hover:border-orange-600 text-orange-400" />) : (<Camera className="w-15 h-15 p-4 text-orange-400 border transition-colors rounded-full hover:text-orange-600 hover:border-orange-600" />)
                    }
                    <div className="flex flex-col items-center gap-2">
                        <h3 className=" text-xl font-bold text-stone-900 mb-2">
                            {isDragActive ? "Drop the image here" : "Scan Your Pantry"}
                        </h3>
                        <p className="text-sm text-stone-600 max-w-sm">
                            {isDragActive ? "Release to upload" : "Take a photo or drag & drop an image of your fridge/Pantry."}
                        </p>
                    </div>

                    {!isDragActive && (
                        <div className="fle flex-col sm:flex-row gap-5">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current.click();
                                }}
                                className="gap-2"
                            >
                                <Camera className="w-4 h-4" />
                                Take a Photo
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    open();
                                }}
                                className="gap-2"
                            >
                                <ImageIcon className="w-4 h-4" />
                                Upload a Photo
                            </Button>
                        </div>
                    )}
                    <div className="text-xs text-stone-600 flex items-center opacity-40">
                        <span>Supports, JPG, PNG, WEBP . Max 10MB</span>
                    </div>
                </div>
            </div>

            {/* {Hidden file input with capture attribute for mobile */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInputChange}
                className="hidden"
            />
        </>
    );
}

export default ImageUploader