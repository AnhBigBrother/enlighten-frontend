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

export const PostHeader = ({
	postId,
	authorId,
	authorName,
	authorImage,
	createdAt,
	linkPost,
}: PostHeaderProps) => {
	return (
		<div className='flex w-full flex-row items-center justify-between'>
			<ProgressLink
				className='flex flex-row items-center space-x-3'
				href={`/user/${authorId}`}>
				<Avatar>
					<AvatarImage src={authorImage}></AvatarImage>
					<AvatarFallback>
						<User className='h-full w-full cursor-pointer bg-accent p-2' />
					</AvatarFallback>
				</Avatar>
				<div className='flex flex-col items-start justify-center text-sm'>
					<h4 className='font-bold'>{authorName}</h4>
					<p className='font-light text-muted-foreground'>
						{new Date(createdAt).toLocaleTimeString("en-us", {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
			</ProgressLink>
			<div className='flex h-full flex-row space-x-2 p-2'>
				{linkPost && (
					<ProgressLink
						className=' aspect-square text-muted-foreground hover:text-primary'
						title='Go to post'
						href={linkPost}>
						<ChevronRight />
					</ProgressLink>
				)}
			</div>
		</div>
	);
};
