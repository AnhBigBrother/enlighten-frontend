import React from "react";
import { TPostData } from "@/types/post";
import { PostScroller } from "@/components/scrollers/post-scroller";
import { BACKEND_DOMAIN } from "@/constants";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
	const serverLoadedPosts: TPostData[] = await fetch(
		`${BACKEND_DOMAIN}/api/v1/posts?sort=new&limit=5&offset=0`,
	)
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return notFound();
		});

	return (
		<PostScroller
			path='api/v1/posts'
			serverLoadedPosts={serverLoadedPosts || []}
			label={<h1 className='ml-1 text-lg font-bold'>Feeds:</h1>}
		/>
	);
}
