"use client"

import { getorGenerateRecipe, removeRecipeFromCollection, saveRecipeToCollection } from '@/actions/recipe.actions';
import useFetch from '@/hooks/use-fetch';
import { Button } from '@base-ui/react';
import { AlertCircle, ArrowLeft, BookmarkCheck, Bookmark, Clock, Flame, Loader2, User, ChefHat, Lightbulb, CheckCircle2 } from 'lucide-react';
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
            <div className="container mx-auto max-w-5xl">
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

                            {/* pdf download button */}
                        </div>
                    </div>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Ingredients & Nutrition */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 border-2 border-stone-200 lg:sticky lg:top-24">
                            <h2 className="text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <ChefHat className="w-6 h-6 text-orange-600" />
                                Ingredients
                            </h2>

                            {Object.entries(
                                recipe.ingredients.reduce((acc, ing) => {
                                    const cat = ing.category || "Other";
                                    if (!acc[cat]) acc[cat] = [];
                                    acc[cat].push(ing);
                                    return acc;
                                }, {})
                            ).map(([category, items]) => (
                                <div key={category} className="mb-6 last:mb-0">
                                    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-3">
                                        {category}
                                    </h3>

                                    <ul className="space-y-2">
                                        {items.map((ingredient, i) => (
                                            <li
                                                key={i}
                                                className="flex justify-center items-center gap-2 text-stone-700 py-2 border-b border-stone-100 last:border-0"
                                            >
                                                <span className="flex-1">{ingredient.item}</span>
                                                <span className="font-bold text-orange-600 text-sm whitespace-nowrap">{ingredient.amount}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            {/* nutrition info  */}
                            {recipe.nutrition && (
                                <div classNam="mt-6 pt-6 border-t-2 border-stone-200">
                                    <h3 className="font-bold text-stone-900 mb-3 uppercase tracking-wide text-sm"> Nutrition (per serving)</h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-orange-50 p-3 text-center border-2 border-orange-100">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {recipe.nutrition.calories}
                                            </div>
                                            <div className="text-xs text-stone-500 font-bold uppercase tracking-wide">
                                                Calories
                                            </div>
                                        </div>

                                        <div className="bg-stone-50 p-3 text-center border-2 border-stone-100">
                                            <div className="text-2xl font-bold text-stone-900">
                                                {recipe.nutrition.protein}
                                            </div>
                                            <div className="text-xs text-stone-500 font-bold uppercase tracking-wide">
                                                Protein
                                            </div>
                                        </div>

                                        <div className="bg-stone-50 p-3 text-center border-2 border-stone-100">
                                            <div className="text-2xl font-bold text-stone-900">
                                                {recipe.nutrition.carbs}
                                            </div>
                                            <div className="text-xs text-stone-500 font-bold uppercase tracking-wide">
                                                Carbs
                                            </div>
                                        </div>

                                        <div className="bg-stone-50 p-3 text-center border-2 border-stone-100">
                                            <div className="text-2xl font-bold text-stone-900">
                                                {recipe.nutrition.fat}
                                            </div>
                                            <div className="text-xs text-stone-500 font-bold uppercase tracking-wide">
                                                Fat
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right Column - Instructions & Tips */}
                    <div className="lg:col-span-2 space-y-6 ">
                        <div className="bg-white p-8 border-2 border-stone-200">
                            <h2 className="text-2xl font-bold text-stone-900 mb-6">Step-by-Step Instructions</h2>

                            <div>
                                {recipe.instructions.map((step, index) => (
                                    <div
                                        key={step.step}
                                        className={`relative pl-12 pb-8 ${index !== recipe.instructions.length - 1 ? "border-1-2 border-orange-300 ml-5" : "ml-5"
                                            }`}
                                    >
                                        {/* step number */}
                                        <div
                                            className='absolute -left-5 top-0 w-10 h-10 bg-orange-600 text-white flex items-center justify-center font-bold border-2 border-orange-800'>{step.step}
                                        </div>

                                        <div>
                                            <h3
                                                className="font-bold text-lg texrt-stone-900 mb-2"
                                            >{step.title}</h3>
                                            <p className="text-stone-700 font-light mb-3">
                                                {step.instruction}
                                            </p>

                                            {step.tip && (
                                                <div className="bg-orange-50 border-1-4 border-orange-600 p-4">
                                                    <p className="text-sm text-orange-900 flex items-start gap-2">
                                                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 fill-orange-600" />
                                                        <span>
                                                            <strong className="font-bold">Pro Tip: </strong>{" "}
                                                            {step.tip}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-green-900 mb-1">
                                            You&apos;re all done!
                                        </h3>
                                        <p className="text-sm text-green-800 font-light">
                                            Plate your masterpiece and enjoy your delicious{" "}
                                            {recipe.title}!
                                        </p>
                                    </div>
                                </div>
                            </div>
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

