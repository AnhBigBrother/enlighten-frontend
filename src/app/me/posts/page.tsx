import { PostScroller } from "@/components/scrollers/post-scroller";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BACKEND_URL } from "@/constants";
import { TPostData } from "@/types/post";
import { TUserOverview } from "@/types/user";
import {
	NotebookText,
	Rss,
	ShieldCheck,
	ThumbsDown,
	ThumbsUp,
	User,
	UserRoundCheck,
} from "lucide-react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import React from "react";

const MyPosts = async () => {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;

	if (!access_token) {
		redirect("/");
	}

	const getMyOverview: Promise<TUserOverview> = fetch(`${BACKEND_URL}/api/v1/me/overview`, {
		headers: {
			authorization: `Bearer ${access_token}`,
		},
	})
		.then((res) => res.json())
		.catch((err) => notFound());
	const getMyPosts: Promise<TPostData[]> = fetch(
		`${BACKEND_URL}/api/v1/me/posts?sort=new&limit=5&offset=0`,
		{
			headers: {
				authorization: `Bearer ${access_token}`,
			},
		},
	)
		.then((res) => res.json())
		.catch((err) => redirect("/"));

	const [myOverview, myPosts] = await Promise.all([getMyOverview, getMyPosts]);

	return (
		<div className='my-10 flex w-full flex-col'>
			<div className='flex w-full flex-row gap-5'>
				<div className='aspect-square h-fit w-1/4 min-w-32 max-w-48 flex-shrink-0'>
					<Avatar className='h-full w-full rounded-lg'>
						<AvatarImage src={myOverview.image}></AvatarImage>
						<AvatarFallback>
							<User className='h-full w-full bg-accent p-2' />
						</AvatarFallback>
					</Avatar>
				</div>
				<div className='flex flex-grow flex-col pt-2'>
					<div className='flex max-w-48 flex-col sm:max-w-full'>
						<h2 className='text-xl font-bold '>{myOverview.name}</h2>
						<p className='truncate text-sm text-muted-foreground'>{myOverview.email}</p>
					</div>
					<p className='my-3 text-sm italic text-muted-foreground sm:text-base'>
						{myOverview.bio}
					</p>
					<div className='my-1 hidden gap-6 text-sm text-muted-foreground sm:flex'>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='Joined date'>
							<ShieldCheck className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>
								{new Date(myOverview.created_at).toLocaleDateString("en-us", {
									dateStyle: "medium",
								})}
							</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='total posts'>
							<NotebookText className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{myOverview.total_posts} posts</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='follower'>
							<UserRoundCheck className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{myOverview.follower}</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='following'>
							<Rss className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{myOverview.following}</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='total upvote'>
							<ThumbsUp className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{myOverview.total_upvoted}</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='total downvote'>
							<ThumbsDown className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{myOverview.total_downvoted}</span>
						</div>
					</div>
				</div>
			</div>
			<div className='my-5 flex w-full justify-center gap-5 text-sm text-muted-foreground sm:hidden'>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='Joined date'>
					<ShieldCheck className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>
						{new Date(myOverview.created_at).toLocaleDateString("en-us", {
							dateStyle: "medium",
						})}
					</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='total posts'>
					<NotebookText className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{myOverview.total_posts} posts</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='follower'>
					<UserRoundCheck className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{myOverview.follower}</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='following'>
					<Rss className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{myOverview.following}</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='total upvote'>
					<ThumbsUp className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{myOverview.total_upvoted}</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='total downvote'>
					<ThumbsDown className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{myOverview.total_downvoted}</span>
				</div>
			</div>

			<PostScroller
				className='mt-2'
				path={`/api/v1/me/posts`}
				serverLoadedPosts={myPosts}
				label={<h1 className='font-bold'>Your posts:</h1>}
			/>
		</div>
	);
};

export default MyPosts;
