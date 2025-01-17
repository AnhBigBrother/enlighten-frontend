import { PostScroller } from "@/components/scrollers/post-scroller";
import { BACKEND_DOMAIN } from "@/constants";
import { TPostData } from "@/types/post";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Saved = async () => {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;

	if (!access_token) {
		redirect("/");
	}

	const savedPosts: TPostData[] = await fetch(`${BACKEND_DOMAIN}/api/v1/posts/saved`, {
		headers: {
			authorization: `Bearer ${access_token}`,
		},
	})
		.then((res) => {
			if (!res.ok) {
				throw res;
			}
			return res.json();
		})
		.catch((err) => {
			redirect("/");
		});

	return (
		<PostScroller
			path='api/v1/posts/saved'
			sort={false}
			clipContent={true}
			serverLoadedPosts={savedPosts || []}
			label={<h1 className='ml-1 mt-2 text-lg font-bold'>Your saved posts:</h1>}
		/>
	);
};

export default Saved;
