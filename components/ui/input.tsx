import * as React from "react"
import {Input as InputPrimitive} from "@base-ui/react/input"

import {cn} from "@/lib/utils"

function Input({className, type, ...props}: React.ComponentProps<"input">) {
    return (
        <InputPrimitive
            type={type}
            data-slot="input"
            className={cn(
                "h-14 w-full min-w-0 rounded-[8px] border border-[#dddddd] bg-white px-3.5 py-1 text-base text-[#222222] transition-colors outline-none",
                "placeholder:text-[#929292]",
                "focus-visible:border-[#222222] focus-visible:border-2 focus-visible:ring-0",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#f7f7f7] disabled:opacity-50",
                "aria-invalid:border-[#c13515] aria-invalid:border-2",
                "dark:bg-[#222222] dark:border-[#3a3a3a] dark:text-[#f0f0f0] dark:placeholder:text-[#666666]",
                "dark:focus-visible:border-[#f0f0f0]",
                "dark:disabled:bg-[#2a2a2a]",
                "dark:aria-invalid:border-[#ff6b4a]",
                className
            )}
            {...props}
        />
    )
}

export {Input}
