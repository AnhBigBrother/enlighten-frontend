import { cn } from "@/lib/utils";
import React from "react";

type Props = {
	title: string;
	content: string;
	clipped?: boolean;
};

export const PostContent = ({ title, content, clipped = false }: Props) => {
	return (
		<div className='flex flex-col gap-2 p-1 py-3 text-sm'>
			<h3 className='text-lg font-semibold'>{title}</h3>
			<p className={cn("whitespace-pre-line", clipped && "line-clamp-[8] overflow-y-clip")}>
				{content}
			</p>
		</div>
	);
};
