import arcjet, { tokenBucket } from "@arcjet/next";

export const aj = arcjet({
    key : process.env.NEXT_PUBLIC_ARCJET_KEY,
    rules:[],
})

//free tier pantry can limits (10 scans per month)

export const freePantryScans = aj.withRule(
    tokenBucket({
        mode:"LIVE",
        chracteristic:["userId"],
        refillRate:10,
        interval:"30d",
        capcaity:10,
    })
)

//free tier meal recommendations (5per monts)

export const freeMealRecommendation = aj.withRule(
    tokenBucket({
        mode:"LIVE",
        chracteristic:["userId"],
        refillRate:5,
        interval:"30d",
        capcaity:5,
    })
)

//pro tier -effextively unlimited

// 1000 requests per dayt should be more than enough for any user

export const proTierLimit = aj.withRule(
    tokenBucket({
        mode:"LIVE",
        chracteristic:["userId"],
        refillRate:1000,
        interval:"1d",
        capcaity:1000,
    })
)
