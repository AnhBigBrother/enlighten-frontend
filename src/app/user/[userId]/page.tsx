import { PostScroller } from "@/components/post-scroller";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BACKEND_DOMAIN } from "@/constants";
import { TPostData } from "@/types/post";
import { TUserOverview } from "@/types/user";
import { BadgePlus, NotebookText, Plus, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const UserPage = async ({ params }: { params: Promise<{ userId: string[] }> }) => {
	const { userId } = await params;

	const getUserOverview: Promise<TUserOverview> = await fetch(
		`${BACKEND_DOMAIN}/api/v1/users/${userId}/overview`,
	)
		.then((res) => res.json())
		.catch((err) => notFound());
	const getUserPosts: Promise<TPostData[]> = await fetch(
		`${BACKEND_DOMAIN}/api/v1/users/${userId}/posts?sort=new&limit=5&offset=0`,
	)
		.then((res) => res.json())
		.catch((err) => notFound());

	const [userOverview, userPosts] = await Promise.all([getUserOverview, getUserPosts]);

	return (
		<div className='my-10 flex w-full flex-col px-3 sm:px-5'>
			<div className='mb-5 flex flex-col items-center'>
				<div className='flex h-fit w-fit gap-6 sm:w-full'>
					<Avatar className='h-[6.5rem] w-[6.5rem] rounded-lg sm:h-40 sm:w-40'>
						<AvatarImage src={userOverview.image}></AvatarImage>
						<AvatarFallback>
							<User className='h-full w-full bg-accent p-2' />
						</AvatarFallback>
					</Avatar>
					<div className='flex h-fit flex-shrink-0 flex-grow flex-col py-1'>
						<div className='flex w-full flex-col justify-between gap-3 sm:flex-row'>
							<div className='flex flex-col'>
								<h2 className='text-xl font-bold '>{userOverview.name}</h2>
								<p className='text-sm text-muted-foreground'>{userOverview.email}</p>
							</div>
							<Button className='w-fit'>
								<Plus />
								<span>Folllow</span>
							</Button>
						</div>
						<p className='my-3 italic'>{userOverview.bio}</p>
						<div className='my-1 hidden gap-8 text-muted-foreground sm:flex'>
							<div
								className='flex flex-col items-center gap-y-2 text-sm font-semibold'
								title='Total post'>
								<NotebookText className='h-7 w-7 sm:h-8 sm:w-8' />
								<span>{userOverview.total_posts}</span>
							</div>
							<div
								className='flex flex-col items-center gap-y-2 text-sm font-semibold'
								title='Joined date'>
								<BadgePlus className='h-7 w-7 sm:h-8 sm:w-8' />
								<span>
									{new Date(userOverview.created_at).toLocaleDateString("en-us", {
										dateStyle: "medium",
									})}
								</span>
							</div>
							<div
								className='flex flex-col items-center gap-y-2 text-sm font-semibold'
								title='Total up voted'>
								<ThumbsUp className='h-7 w-7 sm:h-8 sm:w-8' />
								<span>{userOverview.total_upvoted}</span>
							</div>
							<div
								className='flex flex-col items-center gap-y-2 text-sm font-semibold'
								title='Total down voted'>
								<ThumbsDown className='h-7 w-7 sm:h-8 sm:w-8' />
								<span>{userOverview.total_downvoted}</span>
							</div>
						</div>
					</div>
				</div>
				<div className='mt-3 flex gap-8 text-muted-foreground sm:hidden'>
					<div
						className='flex flex-col items-center gap-y-2 text-sm font-semibold'
						title='Total post'>
						<NotebookText className='h-7 w-7 sm:h-8 sm:w-8' />
						<span>{userOverview.total_posts}</span>
					</div>
					<div
						className='flex flex-col items-center gap-y-2 text-sm font-semibold'
						title='Joined date'>
						<BadgePlus className='h-7 w-7 sm:h-8 sm:w-8' />
						<span>
							{new Date(userOverview.created_at).toLocaleDateString("en-us", {
								dateStyle: "medium",
							})}
						</span>
					</div>
					<div
						className='flex flex-col items-center gap-y-2 text-sm font-semibold'
						title='Total up voted'>
						<ThumbsUp className='h-7 w-7 sm:h-8 sm:w-8' />
						<span>{userOverview.total_upvoted}</span>
					</div>
					<div
						className='flex flex-col items-center gap-y-2 text-sm font-semibold'
						title='Total down voted'>
						<ThumbsDown className='h-7 w-7 sm:h-8 sm:w-8' />
						<span>{userOverview.total_downvoted}</span>
					</div>
				</div>
			</div>
			<PostScroller
				path={`api/v1/users/${userId}/posts`}
				serverLoadedPosts={userPosts}
			/>
		</div>
	);
};

export default UserPage;
