"use server";

import { Post } from "@/components/post";
import { PostAdditional } from "@/components/post/post-additional";
import { PostContent } from "@/components/post/post-content";
import { PostFooter } from "@/components/post/post-footer";
import { PostHeader } from "@/components/post/post-header";
import { BACKEND_URL } from "@/constants";
import { TPostData } from "@/types/post";
import { notFound } from "next/navigation";
import React from "react";

const PostPage = async ({ params }: { params: Promise<{ postId: string[] }> }) => {
	const { postId } = await params;
	const postData: TPostData = await fetch(`${BACKEND_URL}/api/v1/posts/${postId}`)
		.then((res) => res.json())
		.catch((error) => {
			return notFound();
		});

	return (
		<div className='flex w-full flex-col items-start justify-start py-5'>
			<PostHeader
				postId={postData.id}
				authorId={postData.author_id}
				authorImage={postData.author_image}
				authorName={postData.author_name}
				createdAt={postData.created_at}
			/>
			<PostContent
				title={postData.title}
				content={postData.content}
			/>
			<PostFooter
				id={postData.id}
				comments_count={postData.comments_count}
				up_voted={postData.up_voted}
				down_voted={postData.down_voted}
				created_at={postData.created_at}
			/>
			<PostAdditional
				data={{
					id: postData.id,
					title: postData.title,
					author_id: postData.author_id,
					author_image: postData.author_image,
					author_name: postData.author_name,
					comment_count: postData.comments_count,
					up_voted: postData.up_voted,
					down_voted: postData.down_voted,
				}}
			/>
		</div>
	);
};

export default PostPage;
