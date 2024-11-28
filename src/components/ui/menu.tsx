import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React from "react";

type Props = {
	children: React.ReactNode;
	className?: string;
};

export const MenuList = React.forwardRef<HTMLMenuElement, Props>(
	({ children, className }, ref) => {
		return (
			<menu
				className={cn("flex h-fit w-full flex-col items-start justify-start", className)}
				ref={ref}>
				{children}
			</menu>
		);
	},
);

export const MenuGroupHeader = React.forwardRef<HTMLLabelElement, Props>(
	({ children, className }, ref) => {
		return (
			<label
				className={cn(
					"flex w-full flex-row items-center px-2 py-1 text-base font-semibold",
					className,
				)}
				ref={ref}>
				{children}
				<ChevronRight className='ml-3 h-5 w-5' />
			</label>
		);
	},
);

export const MenuGroup = React.forwardRef<HTMLDivElement, Props>(
	({ children, className }, ref) => {
		return (
			<div
				className={cn("flex h-fit w-full flex-col gap-0", className)}
				ref={ref}>
				{children}
			</div>
		);
	},
);

export const MenuItem = React.forwardRef<HTMLDivElement, Props & { active?: boolean }>(
	({ children, className, active }, ref) => {
		return (
			<div
				className={cn(
					"w-full cursor-pointer rounded-md p-2 hover:bg-accent",
					className,
					active && "bg-accent",
				)}
				ref={ref}>
				{children}
			</div>
		);
	},
);

export const MenuSeperator = () => {
	return <div className='my-3 w-full border'></div>;
};
