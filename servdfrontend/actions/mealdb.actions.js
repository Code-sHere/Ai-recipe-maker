"use server";

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1/";

export async function getRecipeOfTheDay() {

    try {
        const res = await fetch (`${MEALDB_BASE}/random.php`,{
            next: {revalidate : 86400},//cache for 1 day
        });

        if(!res.ok){
            throw new Error("Failed to fetch recipe of the day");
        }

        const data = await res.json();
        return {
            success: true,
            recipe: data.meals[0],
        };

    } catch (error) {
        console.error("Error fetching recipe of the day:", error);
        throw new Error(error.message || "Failed to load recipe");
    }
}

export async function getCategories() {

    try {
        const res = await fetch (`${MEALDB_BASE}/list.php?c=list`,{
            next: {revalidate : 604800},//cache for 1 week
        });

        if(!res.ok){
            throw new Error("Failed to fetch recipe of the day");
        }

        const data = await res.json();
        return {
            success: true,
            categories: data.meals || [],
        };

    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error(error.message || "Failed to load categories");
    }

}

export async function getAreas() {

    try {
        const res = await fetch (`${MEALDB_BASE}/list.php?a=list`,{
            next: {revalidate : 604800},//cache for 1 week
        });

        if(!res.ok){
            throw new Error("Failed to fetch areas");
        }

        const data = await res.json();
        return {
            success: true,
            areas: data.meals || [],
        };

    } catch (error) {
        console.error("Error fetching areas:", error);
        throw new Error(error.message || "Failed to load areas");
    }

}

export async function getMealsByCategory(category) {

    try {
        const res = await fetch (`${MEALDB_BASE}/filter.php?a=${category}`,{
            next: {revalidate : 86400},//cache for 1 day
        });

        if(!res.ok){
            throw new Error("Failed to fetch ");
        }

        const data = await res.json();
        return {
            success: true,
            meals: data.meals || [],
            area,
        };

    } catch (error) {
        console.error("Error fetching areas:", error);
        throw new Error(error.message || "Failed to load areas");
    }

}

export async function getMealsByArea(area) {

    try {
        const res = await fetch (`${MEALDB_BASE}/filter.php?c=${area}`,{
            next: {revalidate : 86400},//cache for 1 day
        });

        if(!res.ok){
            throw new Error("Failed to fetch meals");
        }

        const data = await res.json();
        return {
            success: true,
            meals: data.meals || [],
            category,
        };

    } catch (error) {
        console.error("Error fetching meals:", error);
        throw new Error(error.message || "Failed to load categories");
    }

}