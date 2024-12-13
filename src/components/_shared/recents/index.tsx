"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProgressLink } from "@/components/ui/progress-link";
import { ScrollArea } from "@/components/ui/scroll-area";
import useRecentStore, { TRecent } from "@/stores/recent-store";
import { ArrowBigDown, ArrowBigUp, MessageSquare, User } from "lucide-react";
import React from "react";

export const Recents = () => {
	const recents = useRecentStore.use.recents();
	const clear = useRecentStore.use.reset();
	return (
		<aside className='sticky top-16 hidden h-[calc(100vh-4rem)] w-80 flex-shrink-0 py-5 lg:block'>
			<ScrollArea className='h-full w-full rounded-xl'>
				<div className='h-fit max-h-full w-full rounded-xl bg-secondary p-3 text-sm'>
					<div className='flex w-full items-center justify-between py-1'>
						<h3 className='px-2 font-bold'>RECENTS</h3>
						<Button
							variant='link'
							className='text-blue-500'
							onClick={() => clear()}>
							Clear
						</Button>
					</div>
					{recents.map((data) => (
						<RecentPostCard
							data={data}
							key={data.id}
						/>
					))}
				</div>
			</ScrollArea>
		</aside>
	);
};

const RecentPostCard = ({ data }: { data: TRecent }) => {
	return (
		<>
			<div className='p-3'>
				<div className='w-full border-t border-muted-foreground'></div>
			</div>
			<ProgressLink
				href={`/post/${data.id}`}
				className='flex flex-col p-2'>
				<div className='mb-1 flex w-full flex-row items-center space-x-2'>
					<Avatar className='h-8 w-8'>
						<AvatarImage src={data.author_image}></AvatarImage>
						<AvatarFallback>
							<User className='h-full w-full cursor-pointer bg-background p-2' />
						</AvatarFallback>
					</Avatar>
					<h4 className='font-bold'>{data.author_name}</h4>
				</div>
				<p className='p-1'>{data.title}</p>
				<div className='flex flex-row gap-3'>
					<div className='flex flex-row gap-2'>
						<div className='flex h-fit flex-row items-center justify-center rounded-lg py-1'>
							<ArrowBigUp className='mr-1 h-4 w-4' />
							<span>{data.up_voted}</span>
						</div>
						<div className='flex h-fit flex-row items-center justify-center rounded-lg py-1'>
							<ArrowBigDown className='mr-1 h-4 w-4' />
							<span>{data.down_voted}</span>
						</div>
					</div>
					<div className='flex h-fit flex-row items-center justify-center rounded-lg py-1'>
						<MessageSquare className='mr-1 h-4 w-4' />
						<span>{data.comment_count}</span>
					</div>
				</div>
			</ProgressLink>
		</>
	);
};
