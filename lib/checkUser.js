import {auth, currentUser } from "@clerk/nextjs/server";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function checkUser() {
    const clerkUser = await currentUser();

    if (!clerkUser) return null;

    if (!STRAPI_API_TOKEN) {
        console.error("Missing STRAPI_API_TOKEN");
        return clerkUser;
    }

    const {has} = await auth();
    const subscriptionTier = has({plan: "pro"}) ? "pro" : "free";

    const email = clerkUser.emailAddresses[0].emailAddress;

    try {
        // Check if user already exists
        const existingRes = await fetch(
            `${STRAPI_URL}/api/users?filters[email][$eq]=${encodeURIComponent(email)}`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
                cache: "no-store",
            }
        );

        if (!existingRes.ok) {
            console.log(await existingRes.text());
            return clerkUser;
        }

        const existingUsers = await existingRes.json();

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            const existingUser = existingUsers[0];
            
            if(existingUser.subscriptionTier !== subscriptionTier) {
                try{
                    const updateRes = await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
                        method:"PUT",
                        headers:{
                            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                            "Content-Type": "application/json",
                        },
                        body:JSON.stringify({
                            subscriptionTier
                        })
                    });
                    const updateText = await updateRes.text();

                    if(!updateRes.ok){
                        console.error("Failed to sync subscriptionTier:", updateText);
                        // Fall back to the stale existing user rather than failing entirely
                        return existingUser;
                    }
                    return JSON.parse(updateText);
                }
                catch(syncErr){
                    console.error("Failed to sync subscriptionTier:", syncErr);
                    // Fall back to the stale existing user rather than failing entirely
                    return existingUser;
                }
            }

            return existingUser;
        }

        // Get Authenticated role
        const roleRes = await fetch(
            `${STRAPI_URL}/api/users-permissions/roles`,
            {
                headers: {
                    Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                },
            }
        );

        const roleData = await roleRes.json();

        const authenticatedRole =
            roleData.roles?.find((r) => r.type === "authenticated") ||
            roleData.find?.((r) => r.type === "authenticated");

        if (!authenticatedRole) {
            throw new Error("Authenticated role not found");
        }

        // Create user
        const createRes = await fetch(`${STRAPI_URL}/api/users`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: clerkUser.username ??
                    email.split("@")[0],

                email,

                password: `clerk_${clerkUser.id}_${Date.now()}`,

                confirmed: true,

                blocked: false,

                role: authenticatedRole.id,

                clerkID: clerkUser.id,

                firstName: clerkUser.firstName || "",

                lastName: clerkUser.lastName || "",

                imageUrl: clerkUser.imageUrl || "",

                subscriptionTier,
            }),
        });

        const text = await createRes.text();

        console.log("Status:", createRes.status);
        console.log("Response:", text);
        console.log("Created user:", text); 

        if (!createRes.ok) {
            throw new Error(text);
        }

        return JSON.parse(text);
    } catch (err) {
        console.error(err);
        return clerkUser;
    }
}