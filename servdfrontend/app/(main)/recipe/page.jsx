"use client"

import { getorGenerateRecipe, removeRecipeFromCollection, saveRecipeToCollection } from '@/actions/recipe.actions';
import useFetch from '@/hooks/use-fetch';
import { Button } from '@base-ui/react';
import { AlertCircle, ArrowLeft, BookmarkCheck, Bookmark, Clock, Flame, Loader2, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner'
import React, { Suspense, useEffect, useState } from 'react'
import { ClockLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

function RecipeContent() {
    const searchParams = useSearchParams();
    const recipeName = searchParams.get('cook');
    const router = useRouter();

    const [recipe, setRecipe] = useState(null);
    const [recipeId, setRecipeId] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    // get or generate recipe
    const {
        loading: loadingRecipe,
        data: recipeData,
        fetchData: fetchRecipe,
    } = useFetch(getorGenerateRecipe);

    // save to collection
    const {
        loading: saving,
        data: saveData,
        fecthData: saveToCollection,
    } = useFetch(saveRecipeToCollection);

    // remove from collection
    const {
        loading: removing,
        data: removeData,
        fecthData: removeFromCollection,
    } = useFetch(removeRecipeFromCollection);



    useEffect(() => {
        if (recipeName && !recipe) {
            const formData = new FormData();
            formData.append("recipeName", recipeName);
            fetchRecipe(formData);
        }
    }, [recipeName]);

    //update recipe when data arrives

    useEffect(() => {
        if (recipeData?.success) {
            setRecipe(recipeData.recipe);
            setRecipeId(recipeData.recipe.id);
            setIsSaved(recipeData.alreadySaved);

            if (recipeData.fromDatabase) {
                toast.success("Recipe saved to your collection");
            } else {
                toast.success("Recipe removed from your collection");
            }
        }
    }, [recipeData])

    useEffect(() => {
        if (saveData?.success) {
            if (saveData.alreadySaved) {
                toast.info("Recipe already saved to your collection");
            } else {
                setIsSaved(true);
                toast.success("Recipe saved to your collection");
            }
        }
    }, [saveData])

    useEffect(() => {
        if (removeData?.success) {
            setIsSaved(false);
            toast.success("Recipe removed from your collection");
        }
    }, [removeData])


    const handleToggleSave = async () => {
        if (!recipeId) return;

        const formData = new FormData();
        formData.append("recipeId", recipeId);

        if (isSaved) {
            await removeFromCollection(formData);
        } else {
            await saveToCollection(formData);
        }
    }


    // no recipe name in url 
    if (!recipeName) {
        return <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl text-center py-20">
                <div className="bg-orange-50 w-20 h-20 border-2 border-orange-300 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className=" w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">No Recipe Specified</h2>
                <p className="text-stone-600 mb-6 font-light">Please select a recipe from the dashboard</p>

                <Link href="/dashboard" />
                <Button className="bg-orange-600 hover:bg-orange-700">Go to Dashboard</Button>
            </div>
        </div>
    }

    if (loadingRecipe === null || loadingRecipe) {
        return <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl text-center py-20 ">
                <ClockLoader className="mx-auto mb-6" color="#dc6300" />
                <h2 className="text-3xl font-bold text-stone-900 mb-2 tracking-tight">
                    Preparing your Recipe
                </h2>
                <p>Our AI Chef is crafting detiled instructions for {" "} <span className="font-bold text-orange-700">{recipeName}</span>...</p>
                <div className="mt-8 max-w-md mx-auto">
                    <div className="flex items-center gap-3 text-sm text-stone-500">
                        <div className="flex-1 h-1 bg-stone-200 overflow-hidden relative">
                            <div className="absolute left-0 top-0 h-full bg-orange-600 animate-slow-fill" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    if (loadingRecipe === false && !recipe) {
        return <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl text-center py-20">
                <div className="bg-orange-50 w-20 h-20 border-2 border-orange-300 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className=" w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Failed to load recipe</h2>
                <p className="text-stone-600 mb-6 font-light">Something went wrong while loadding the recipe. please try again</p>

                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="border-2 border-stone-900 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-orange-600 hover:bg-orange-700"
                    >Retry</Button>
                </div>
            </div>
        </div>
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-4 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>

                    <div className="bg-white p-8 md:p-10 border-2 border-stone-200 mb-6">
                        {recipe.imageUrl && (
                            <div className="relative w-full h-72 overflow-hidden mb-6">
                                <Image
                                    src={recipe.imageUrl}
                                    alt={recipe.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width:1200px) 80vw, 1200px"
                                    priority
                                />
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge
                                variant="outline"
                                className='text-orange-600 border-2 border-orange-200 capitalize'
                            >
                                {recipe.cuisine}
                            </Badge>
                            <Badge
                                variant="outline"
                                className='text-orange-600 border-2 border-orange-200 capitalize'
                            >
                                {recipe.category}
                            </Badge>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
                            {recipe.title}
                        </h1>

                        <p className="text-lg text-stone-600 mb-6 font-light">{recipe.description}</p>

                        <div className="flex flex-wrap gap-6 text-stone-600 mb-6">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-600" />
                                <span>{parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} mins total</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-orange-600" />
                                <span className="font-medium">{recipe.servings} servings</span>
                            </div>

                            {recipe.nutrition?.calories && (
                                <div className="flex items-center gap-2">
                                    <Flame className='w-5 h-5 text-orange-600' />
                                    <span className="font-medium">
                                        {recipe.nutrition.calories} kcal/serving
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={handleToggleSave}
                                disabled={saving || removing}
                                className={`${isSaved ? "bg-green-500 hover:bg-green-600" : "bg-orange-600 hover:bg-orange-700"} text-white gap-2 transition-all`}
                            >
                                {
                                    saving || removing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>{saving ? "Saving..." : "Removing..."}</span>
                                        </>
                                    ) : isSaved ? (
                                        <>
                                            <BookmarkCheck className="w-4 h-4" />
                                            Saved to Collection
                                        </>
                                    ) : (
                                        <>
                                            <Bookmark className="w-4 h-4" />Save to Collection</>
                                    )
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function RecipePage() {

    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
                    <div className="container mx-auto max-w-4xl text-center py-20">
                        <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-6" />
                        <p className='text-stone-600'>Loading recipe...</p>
                    </div>
                </div>
            }
        >
            <RecipeContent />
        </Suspense>
    )
}

