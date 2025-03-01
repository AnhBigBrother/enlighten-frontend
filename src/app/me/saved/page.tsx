import { GetAllSavedPosts } from "@/actions/grpc/post";
import { PostScroller } from "@/components/scrollers/post-scroller";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Saved = async () => {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;

	if (!access_token) {
		redirect("/");
	}

	const savedPosts = await GetAllSavedPosts("new", 3, 0)
		.then((res) => {
			if (res.error) {
				throw res.error;
			}
			return res.data!;
		})
		.catch((err) => {
			redirect("/");
		});

	return (
		<PostScroller
			action={GetAllSavedPosts}
			sort={false}
			clipContent={true}
			serverLoadedPosts={savedPosts || []}
			label={<h1 className='ml-1 mt-2 text-lg font-bold'>Your saved posts:</h1>}
		/>
	);
};

export default Saved;
