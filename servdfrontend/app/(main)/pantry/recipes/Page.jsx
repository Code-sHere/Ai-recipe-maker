"use client"

import { getRecipesByPantryIngredients } from '@/actions/recipe.actions'
import React, { useEffect } from 'react'
import useFetch from '@/hooks/use-fetch'
import { AlertCircle, ArrowLeft, ChefHat, Loader2, Package, Sparkles} from 'lucide-react'
import Link from 'next/link'
import { Span } from 'next/dist/trace'

const PantryRecipesPage = () => {

    const {
        loading,
        data: recipesData,
        fetchData: fetchSuggestions,
    } = useFetch(getRecipesByPantryIngredients);

    useEffect(()=>{
        fetchSuggestions();
    },[])

    const recipes = recipesData?.recipes || [];
    const ingredientsUsed = recipesData?.ingredientsUsed || "";


  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
            <Link 
                href="/pantry"
                className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-4 font-medium text-sm"
            >
            <ArrowLeft className="w-4 h-4" />Back to pantry.
            </Link>

            <div className="flex items-center gap-3 mb-6">
                <ChefHat className="w-16 h-16 text-green-600" />
                <div>
                    <h1 className='text-4xl md:text-5xl font-bold text-stone-900 tracking-tight'>
                        What Can I Cook?
                    </h1>
                    <p className='text-stone-700 font-light'>
                        AI-powered recpe suggestions based on your pantry.
                    </p>
                </div>
            </div>

            {/* whats ingredients used to generated the recipe Suggestions */}

            {ingredientsUsed &&(
                <div className="bg-white p-4 border-2 border-stone-200 mb-4">
                    <div className="flex items-center gap-4">
                        <Package className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-bold text-shadow-stone-950 mb-1">
                                Your Available Ingredients: 
                            </h3>
                            <p className="text-stone-600 text-sm font-light">{ingredientsUsed}</p>
                        </div>
                    </div>
                </div>
            )}

            {recipesData !== undefined &&(
                <div className="bg-orange-50 p-4 border-2 border-orange-300 inline-flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <div>
                        {recipesData.recommendationsLimit === "unlimited" ? (
                            <>
                            <Span className="text-orange-700 font-light">
                            {" "}
                            Unlimited AI recommendations (Pro Plan)
                            </Span>
                            </>
                        ):(
                            <span className="text-orange-700 font-light">
                                Upgrade to Pro for unlimted AI recommendations
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
        {/* Laoding the recipes */}
        {loading && (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2  className='w-12 h-12 text-green-600 animate-spin mb-6'/>
                <h2 className='text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-2'>
                    Finding Perfect Recipes...
                </h2>
                <p className="text-stone-700 font-light">
                    Our AI chef is analyzing your pantry to find the perfect recipes for you.
                </p>
            </div>
        )}

        {/* recipes grid using recipe grid card component */}

        {/* empty pantry state */}

        {!loading && recipes.length === 0 && recipesData?.success === false && (
            <div className="bg-white p-12 text-center border-2 border-dashed border-stone-200">
                <div className="bg-orange-100 w-20 h-20 border-2 border-orange-200 flex items-center justify-center rounded-full mx-auto mb-8">
                    <AlertCircle classNAme="w-10 h-10 text-orange-600 " />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                    Your Pantry is Empty
                </h3>
                <p className="text-stone-600 mb-8 max-w-md mx-auto font-light">
                    Add ingredients to your pantry first so we can suggest delicious recipes you can make!..
                </p>
            </div>    
        )}
      </div>
    </div>
  )
}

export default PantryRecipesPage
