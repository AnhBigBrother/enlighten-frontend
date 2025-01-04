import { PostScroller } from "@/components/scrollers/post-scroller";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BACKEND_DOMAIN } from "@/constants";
import { TPostData } from "@/types/post";
import { TUserOverview } from "@/types/user";
import { BadgePlus, NotebookText, Plus, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import React from "react";

const MyPosts = async () => {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;

	if (!access_token) {
		redirect("/");
	}

	const getMyOverview: Promise<TUserOverview> = await fetch(
		`${BACKEND_DOMAIN}/api/v1/me/overview`,
		{
			headers: {
				authorization: `Bearer ${access_token}`,
			},
		},
	)
		.then((res) => res.json())
		.catch((err) => notFound());
	const getMyPosts: Promise<TPostData[]> = await fetch(
		`${BACKEND_DOMAIN}/api/v1/me/posts?sort=new&limit=5&offset=0`,
		{
			headers: {
				authorization: `Bearer ${access_token}`,
			},
		},
	)
		.then((res) => res.json())
		.catch((err) => redirect("/"));

	const [userOverview, userPosts] = await Promise.all([getMyOverview, getMyPosts]);

	return (
		<div className='my-10 flex w-full flex-col'>
			<div className='flex w-full flex-row gap-5'>
				<div className='aspect-square h-fit w-1/4 min-w-32 max-w-48 flex-shrink-0'>
					<Avatar className='h-full w-full rounded-lg'>
						<AvatarImage src={userOverview.image}></AvatarImage>
						<AvatarFallback>
							<User className='h-full w-full bg-accent p-2' />
						</AvatarFallback>
					</Avatar>
				</div>
				<div className='flex flex-grow flex-col pt-2'>
					<div className='flex max-w-48 flex-col sm:max-w-full'>
						<h2 className='text-xl font-bold '>{userOverview.name}</h2>
						<p className='truncate text-sm text-muted-foreground'>{userOverview.email}</p>
					</div>
					<p className='my-3 text-sm italic sm:text-base'>{userOverview.bio}</p>
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
			<div className='my-5 flex w-full justify-center gap-8 text-muted-foreground sm:hidden'>
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

			<PostScroller
				className='mt-2'
				path={`/api/v1/me/posts`}
				serverLoadedPosts={userPosts}
				label={<h1 className='font-bold'>Your posts:</h1>}
			/>
		</div>
	);
};

export default MyPosts;
