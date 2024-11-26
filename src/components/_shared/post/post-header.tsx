import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export const PostHeader = () => {
	return (
		<div className='flex w-full flex-row items-center space-x-3'>
			<Avatar>
				<AvatarImage src=''></AvatarImage>
				<AvatarFallback>
					<User className='h-full w-full cursor-pointer bg-accent p-2' />
				</AvatarFallback>
			</Avatar>
			<div className='flex flex-col items-center justify-center text-sm'>
				<a>Abc Acb</a>
				<a>Abc Acb</a>
			</div>
		</div>
	);
};
