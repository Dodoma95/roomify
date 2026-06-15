import {Button as ButtonPrimitive} from "@base-ui/react/button"
import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "@/lib/utils"

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    "bg-[#ff385c] text-white hover:bg-[#e00b41] active:bg-[#e00b41] rounded-[8px]",
                outline:
                    "border-[#222222] bg-white text-[#222222] hover:bg-[#f7f7f7] rounded-[8px] dark:border-[#f0f0f0] dark:bg-transparent dark:text-[#f0f0f0] dark:hover:bg-[#2a2a2a]",
                secondary:
                    "bg-[#f7f7f7] text-[#222222] hover:bg-[#f2f2f2] rounded-[8px] dark:bg-[#2a2a2a] dark:text-[#f0f0f0] dark:hover:bg-[#333333]",
                ghost:
                    "hover:bg-[#f7f7f7] text-[#222222] rounded-[8px] dark:text-[#f0f0f0] dark:hover:bg-[#2a2a2a]",
                destructive:
                    "bg-[#c13515]/10 text-[#c13515] hover:bg-[#c13515]/20 rounded-[8px] dark:text-[#ff6b4a] dark:bg-[#ff6b4a]/10 dark:hover:bg-[#ff6b4a]/20",
                link: "text-[#ff385c] underline-offset-4 hover:underline",
            },
            size: {
                default: "h-12 gap-2 px-6 text-base font-medium",
                xs: "h-7 gap-1 rounded-[8px] px-3 text-xs",
                sm: "h-9 gap-1.5 rounded-[8px] px-4 text-sm",
                lg: "h-14 gap-2 px-8 text-base font-medium",
                icon: "size-10 rounded-[8px]",
                "icon-xs": "size-7 rounded-[8px]",
                "icon-sm": "size-9 rounded-[8px]",
                "icon-lg": "size-12 rounded-[8px]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Button({
                    className,
                    variant = "default",
                    size = "default",
                    nativeButton,
                    ...props
                }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
    return (
        <ButtonPrimitive
            data-slot="button"
            nativeButton={nativeButton ?? (props.render === undefined)}
            className={cn(buttonVariants({variant, size, className}))}
            {...props}
        />
    )
}

export {Button, buttonVariants}
