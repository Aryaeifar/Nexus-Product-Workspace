import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center border border-transparent whitespace-nowrap outline-none select-none transition-transform duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-apple-primary text-white focus-visible:outline-2 focus-visible:outline-apple-primary-focus",
        outline:
          "rounded-full border-apple-primary bg-transparent text-apple-primary focus-visible:outline-2 focus-visible:outline-apple-primary-focus",
        secondary:
          "rounded-[11px] border-[3px] border-apple-divider bg-apple-pearl text-apple-ink-muted-80",
        ghost: "rounded-full bg-transparent text-apple-primary",
        link: "rounded-none bg-transparent text-apple-primary",
        utility:
          "rounded-[8px] bg-apple-ink text-white focus-visible:outline-2 focus-visible:outline-apple-primary-focus",
        destructive: "rounded-full bg-destructive text-white",
      },
      size: {
        default: "px-[22px] py-[11px] text-[17px] font-normal leading-none",
        sm: "px-[15px] py-2 text-[14px] font-normal leading-[1.29] tracking-[-0.224px]",
        lg: "px-7 py-3.5 text-[18px] font-light leading-none",
        icon: "size-11 rounded-full",
        "icon-xs": "size-6 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-11 rounded-full",
        xs: "px-3 py-1.5 text-[12px] font-normal",
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
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
