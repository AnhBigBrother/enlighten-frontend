"use server";

import { GetPostById } from "@/actions/grpc/public";
import { PostAdditional } from "@/components/post/post-additional";
import { PostContent } from "@/components/post/post-content";
import { PostFooter } from "@/components/post/post-footer";
import { PostHeader } from "@/components/post/post-header";
import { notFound } from "next/navigation";
import React from "react";

const PostPage = async ({ params }: { params: Promise<{ postId: string }> }) => {
	const { postId } = await params;
	const postData = await GetPostById(postId)
		.then((res) => {
			if (res.error) {
				throw res.error;
			}
			return res.data!;
		})
		.catch((error) => {
			return notFound();
		});

	return (
		<div className='flex w-full flex-col items-start justify-start py-5'>
			<PostHeader
				postId={postData.id}
				author={postData.author!}
				createdAt={postData.created_at}
			/>
			<PostContent
				title={postData.title}
				content={postData.content}
			/>
			<PostFooter
				id={postData.id}
				comments_count={postData.comments}
				up_voted={postData.upvote}
				down_voted={postData.downvote}
				created_at={postData.created_at}
			/>
			<PostAdditional
				data={{
					id: postData.id,
					title: postData.title,
					author: postData.author!,
					comment_count: postData.comments,
					up_voted: postData.upvote,
					down_voted: postData.downvote,
				}}
			/>
		</div>
	);
};

export default PostPage;
