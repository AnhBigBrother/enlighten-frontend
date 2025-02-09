import { PostScroller } from "@/components/scrollers/post-scroller";
import { UserOverview } from "@/components/user/overview";
import { BACKEND_DOMAIN } from "@/constants";
import { TPostData } from "@/types/post";
import { TUserOverview } from "@/types/user";
import { notFound } from "next/navigation";
import React from "react";

const UserPage = async ({ params }: { params: Promise<{ userId: string }> }) => {
	const { userId } = await params;

	const getUserOverview: Promise<TUserOverview> = fetch(
		`${BACKEND_DOMAIN}/api/v1/users/${userId}/overview`,
	)
		.then((res) => res.json())
		.catch((err) => notFound());
	const getUserPosts: Promise<TPostData[]> = fetch(
		`${BACKEND_DOMAIN}/api/v1/users/${userId}/posts?sort=new&limit=5&offset=0`,
	)
		.then((res) => res.json())
		.catch((err) => notFound());

	const [userOverview, userPosts] = await Promise.all([getUserOverview, getUserPosts]);

	return (
		<div className='my-10 flex w-full flex-col'>
			<UserOverview userOverview={userOverview} />
			<PostScroller
				path={`api/v1/users/${userId}/posts`}
				serverLoadedPosts={userPosts}
				clipContent
				label={<h1 className='font-bold'>User Posts:</h1>}
				className='mt-3'
			/>
		</div>
	);
};

export default UserPage;
