import { SortType } from "@/actions/grpc/_utils";
import { GetUserOverview, GetUserPosts } from "@/actions/grpc/public";
import { PostScroller } from "@/components/scrollers/post-scroller";
import { UserOverview } from "@/components/user/overview";
import { notFound } from "next/navigation";
import React from "react";

const UserPage = async ({ params }: { params: Promise<{ userId: string }> }) => {
	const { userId } = await params;

	const getUserOverview = GetUserOverview(userId)
		.then((res) => {
			if (res.error) {
				throw res.error;
			}
			return res.data!;
		})
		.catch((err) => notFound());
	const getUserPosts = GetUserPosts({ user_id: userId, limit: 3, offset: 0, sort: "new" })
		.then((res) => {
			if (res.error) {
				throw res.error;
			}
			return res.data!;
		})
		.catch((err) => notFound());

	const [userOverview, userPosts] = await Promise.all([getUserOverview, getUserPosts]);

	return (
		<div className='my-10 flex w-full flex-col'>
			<UserOverview userOverview={userOverview} />
			<PostScroller
				action={async (sort: SortType, limit: number, offset: number) => {
					"use server";
					return GetUserPosts({ user_id: userId, limit, offset, sort });
				}}
				serverLoadedPosts={userPosts}
				clipContent
				label={<h1 className='font-bold'>User Posts:</h1>}
				className='mt-3'
			/>
		</div>
	);
};

export default UserPage;
