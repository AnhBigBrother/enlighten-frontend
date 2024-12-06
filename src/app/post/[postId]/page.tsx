import { PostClient } from "@/components/post/post-client";
import { PostComment } from "@/components/post/post-comment";
import { PostContent } from "@/components/post/post-content";
import { PostFooter } from "@/components/post/post-footer";
import { PostHeader } from "@/components/post/post-header";
import { _get } from "@/lib/fetch";
import { TPostData } from "@/types/post";
import { notFound } from "next/navigation";
import React from "react";

type tParams = Promise<{ postId: string[] }>;

const PostPage = async ({ params }: { params: tParams }) => {
	const { postId } = await params;
	const postData: TPostData = await _get(`/post/${postId}`).catch((error) => {
		return notFound();
	});

	return (
		<div className='flex flex-col items-start justify-start py-5'>
			<PostHeader
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
			<PostComment postId={postData.id} />
			<PostClient
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
