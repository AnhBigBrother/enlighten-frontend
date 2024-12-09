"use client";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

type CollapsibleMenuProps = {
	children: React.ReactNode;
	className?: string;
	open?: boolean;
	label?: string;
};

const CollapsibleMenu = React.forwardRef<HTMLDivElement, CollapsibleMenuProps>(
	({ children, className, label, open = false }, ref) => {
		const [isOpen, setisOpen] = useState<boolean>(open);
		return (
			<Collapsible
				open={isOpen}
				className={cn("w-full", className)}
				ref={ref}>
				<div className='flex flex-row items-center justify-between px-2 py-1'>
					{label && <h4 className='font-semibold'>{label}</h4>}
					<CollapsibleTrigger
						asChild
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setisOpen((pre) => !pre);
						}}>
						<IconButton className='ml-2 rounded-md p-1'>
							<ChevronDown
								className={cn("h-5 w-5", {
									"rotate-180": isOpen,
								})}
							/>
						</IconButton>
					</CollapsibleTrigger>
				</div>
				{children}
			</Collapsible>
		);
	},
);

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleMenu };
