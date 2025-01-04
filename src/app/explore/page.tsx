import React from "react";
import { TPostData } from "@/types/post";
import { PostScroller } from "@/components/scrollers/post-scroller";
import { BACKEND_DOMAIN } from "@/constants";
import { notFound } from "next/navigation";
import { UserHorizontalScroller } from "@/components/scrollers/user-horizontal-scroller";

export const dynamic = "force-dynamic";

export default async function Explore() {
	const serverLoadedPosts: TPostData[] = await fetch(
		`${BACKEND_DOMAIN}/api/v1/posts/all?sort=new&limit=5&offset=0`,
	)
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return notFound();
		});

	return (
		<div className='my-5 flex w-full flex-col gap-y-6'>
			<UserHorizontalScroller label={<h1 className='ml-1 text-lg font-bold'>Top authors</h1>} />
			<PostScroller
				path='api/v1/posts/all'
				serverLoadedPosts={serverLoadedPosts || []}
				label={<h1 className='ml-1 text-lg font-bold'>All Posts</h1>}
			/>
		</div>
	);
}
