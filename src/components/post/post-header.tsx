import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, User } from "lucide-react";
import { ProgressLink } from "@/components/_shared/progress-link";

type PostHeaderProps = {
	postId: string;
	authorId: string;
	authorName: string;
	authorImage: string;
	createdAt: string;
	linkPost?: string;
};

export const PostHeader = (props: PostHeaderProps) => {
	return (
		<div className='flex w-full flex-row items-center justify-between'>
			<ProgressLink
				className='flex flex-row items-center space-x-3'
				href={`/user/${props.authorId}`}>
				<Avatar>
					<AvatarImage src={props.authorImage}></AvatarImage>
					<AvatarFallback>
						<User className='h-full w-full cursor-pointer bg-accent p-2' />
					</AvatarFallback>
				</Avatar>
				<div className='flex flex-col items-start justify-center text-sm'>
					<h4 className='font-bold'>{props.authorName}</h4>
					<p className='font-light text-muted-foreground'>
						{new Date(props.createdAt).toLocaleTimeString("en-us", {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
			</ProgressLink>
			{props.linkPost && (
				<ProgressLink
					className=' aspect-square h-full p-2 text-muted-foreground hover:text-primary'
					title='Go to post'
					href={props.linkPost}>
					<ChevronRight />
				</ProgressLink>
			)}
		</div>
	);
};
