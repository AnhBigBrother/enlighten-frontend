import React from "react";
import { PostScroller } from "@/components/scrollers/post-scroller";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { GetFollowedPosts } from "@/actions/grpc/post";

export const dynamic = "force-dynamic";

export default async function Home() {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;

	if (!access_token) {
		redirect("/explore");
	}

	const serverLoadedPosts = await GetFollowedPosts("new", 3, 0)
		.then((res) => {
			if (res.error) {
				throw res.error;
			}
			return res.data!;
		})
		.catch((err) => {
			console.error(err);
			return redirect("/explore");
		});

	return (
		<PostScroller
			action={GetFollowedPosts}
			serverLoadedPosts={serverLoadedPosts || []}
			label={<h1 className='ml-1 text-lg font-bold'>Feeds:</h1>}
		/>
	);
}
