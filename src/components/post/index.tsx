import { PostContent } from "@/components/post/post-content";
import { PostFooter } from "@/components/post/post-footer";
import { PostHeader } from "@/components/post/post-header";
import { cn } from "@/lib/utils";
import { TPostData } from "@/types/post";
import React from "react";

const Post = ({
	postData,
	className,
	ref,
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	postData: TPostData;
	ref?: React.Ref<HTMLDivElement>;
}) => {
	return (
		<div
			ref={ref}
			className={cn("w-full", className)}>
			<PostHeader
				postId={postData.id}
				authorId={postData.author_id}
				authorImage={postData.author_image}
				authorName={postData.author_name}
				createdAt={postData.created_at}
				linkPost={`/post/${postData.id}`}
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
		</div>
	);
};

export { Post };
