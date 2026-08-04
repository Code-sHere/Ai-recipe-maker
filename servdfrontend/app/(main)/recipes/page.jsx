"use client";

import { Bookmark, ChefHat, Loader2 } from 'lucide-react'
import React from 'react'
import { getSavedRecipes } from '@/actions/recipe.actions';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';

const SavedRecipePage = () => {

    const{
        loading,
        data: recipesData,
        fetchData: fetchSavedRecipes,
    } = useFetch(getSavedRecipes);

    useEffect(()=>{
        fetchSavedRecipes();
    },[])

    const recipes = recipesData?.recipe || [];

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-1 mb-8">
                <Bookmark className="w-25 h-25 text-orange-600" />
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold texrt-stone-900 tracking-tight">My Saved Recipes</h1>
                    <p className="text-stone-600">
                        Your personal collection of favorite recipes.
                    </p>
                </div>
            </div>

            {loading && (
                <div className="flex felx-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-6"/>
                    <p className="text-stone-600">Loading saved recipes...</p>
                </div>
            )}

            {/* recipes grid */}

            {!loading && recipes.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                    {recipes.map((recipe)=>(
                        <RecipeCard 
                        key={recipe.documentId}
                        recipe={recipe}
                        variant="list"
                        />
                    ))}
                </div>
            )}

            {!loading && recipes.length === 0 && (
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-stone-200">
                    <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bookmark className="w-12 h-12 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">
                        No saved recipes yet
                    </h3>
                    <p className="text-stone-600 mb-8 max-w-md mx-auto">Start exploring recipes and save your favorites to build your personal cookbook!</p>
                    <Link href="/dashboard">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                        <ChefHat className="w-5 h-5"/>
                        Explore Recipes</Button></Link>
                </div>
            )}
        </div>
    </div>
  )
}

export default SavedRecipePage
