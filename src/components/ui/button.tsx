import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-normal text-center leading-tight rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-none disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-[0_3px_0_#d1d5db] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Classic Bubble role system (user pick, 2026-11-06): gradient dome,
        // top shine, hard ledge shadow that collapses when pressed.
        default: "bg-gradient-to-b from-pink-400 to-pink-600 text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.55),inset_0_-3px_0_rgba(0,0,0,0.12),0_5px_0_#9d174d,0_10px_16px_rgba(219,39,119,0.35)] hover:brightness-105 active:translate-y-1 active:shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_1px_0_#9d174d]",
        destructive: "bg-gradient-to-b from-red-300 to-red-600 text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-3px_0_rgba(0,0,0,0.12),0_5px_0_#7f1d1d,0_10px_16px_rgba(220,38,38,0.3)] hover:brightness-105 active:translate-y-1 active:shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_1px_0_#7f1d1d]",
        outline: "bg-white text-[#9d174d] shadow-[inset_0_0_0_3px_#f9a8d4,0_4px_0_#fbcfe8] hover:bg-pink-50 active:translate-y-1 active:shadow-[inset_0_0_0_3px_#f9a8d4,0_1px_0_#fbcfe8]",
        secondary: "bg-gradient-to-b from-violet-300 to-violet-500 text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.5),inset_0_-3px_0_rgba(0,0,0,0.1),0_5px_0_#5b21b6,0_10px_16px_rgba(139,92,246,0.3)] hover:brightness-105 active:translate-y-1 active:shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_1px_0_#5b21b6]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto min-h-10 px-4 py-2",
        sm: "h-auto min-h-9 rounded-md px-3 py-1.5",
        lg: "h-auto min-h-11 rounded-md px-8 py-2",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
