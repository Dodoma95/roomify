"use client";

import {useToastStore} from "@/store/toastStore";

export function useToast() {
    const {addToast} = useToastStore();
    return {
        success: (message: string) => addToast("success", message),
        error: (message: string) => addToast("error", message),
    };
}
