import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";

export type TSortItem = {
	label: string;
	value: string;
};

export const SortBy = ({
	arr,
	state,
	setState,
	...attribute
}: {
	arr: TSortItem[];
	state: TSortItem;
	setState: React.Dispatch<React.SetStateAction<TSortItem>>;
} & React.HTMLAttributes<HTMLElement>) => {
	return (
		<div {...attribute}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className='flex flex-row items-center space-x-2 rounded-lg border p-2 hover:bg-accent'>
						<span>{state.label}</span>
						<ChevronsUpDown className='h-4 w-4' />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					<DropdownMenuLabel>Sort by</DropdownMenuLabel>
					<DropdownMenuSeparator></DropdownMenuSeparator>
					<DropdownMenuGroup>
						{arr.map((ele) => (
							<DropdownMenuItem
								key={ele.value}
								onClick={() => setState(ele)}>
								{ele.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
