import { LoaderCircle } from "lucide-react";
import React from "react";

export const Spinner = () => {
	return (
		<div className='flex h-full w-full items-center justify-center'>
			<div className='aspect-square h-full p-1'>
				<LoaderCircle className='h-full w-full animate-spin' />
			</div>
		</div>
	);
};
