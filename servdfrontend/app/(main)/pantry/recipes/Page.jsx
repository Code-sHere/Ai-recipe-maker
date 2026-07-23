"use client"

import { getRecipesByPantryIngredients } from '@/actions/recipe.actions'
import React, { useEffect } from 'react'
import useFetch from '@/hooks/use-fetch'
import { ArrowLeft} from 'lucide-react'
import Link from 'next/link'

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
        </div>
      </div>
    </div>
  )
}

export default PantryRecipesPage
