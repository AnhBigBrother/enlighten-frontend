import { PostContent } from "@/components/post/post-content";
import { PostFooter } from "@/components/post/post-footer";
import { PostHeader } from "@/components/post/post-header";
import { PostData } from "@/grpc/protobuf/types";
import { cn } from "@/lib/utils";
import React from "react";

const Post = ({
	postData,
	className,
	clipContent = false,
	ref,
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	postData: PostData;
	clipContent?: boolean;
	ref?: React.Ref<HTMLDivElement>;
}) => {
	return (
		<div
			ref={ref}
			className={cn("w-full", className)}>
			<PostHeader
				postId={postData.id}
				author={postData.author!}
				createdAt={postData.created_at}
				linkPost={`/post/${postData.id}`}
			/>
			<PostContent
				title={postData.title}
				content={postData.content}
				clipped={clipContent}
			/>
			<PostFooter
				id={postData.id}
				comments_count={postData.comments}
				up_voted={postData.upvote}
				down_voted={postData.downvote}
				created_at={postData.created_at}
			/>
		</div>
	);
};

export { Post };
