"use client"
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import PricingModal from "./PricingModal";

export default function LockedWrapper({ isPro, children }) {
    if(isPro){
        return children;
    }
    
    return (
        <div className="relative">
            <div className={isPro ? "" : "blur-sm pointer-events-none"}>
                {children}
            </div>
            {!isPro && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-sm border border-orange-200 rounded-xl p-6 max-w-sm text-center shadow-lg">
                        <h3 className="text-xl font-bold mb-2">
                            🔒 Pro Feature
                        </h3>

                        <p className="text-stone-600 mb-4">
                            Upgrade to <span className="font-semibold">SERV'D Pro</span> to
                            unlock:
                        </p>

                        <Link href="/pricing">
                            <Button className="bg-orange-600 hover:bg-orange-700 w-full">
                                Upgrade to Pro
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}