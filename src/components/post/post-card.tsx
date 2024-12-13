import { PostContent } from "@/components/post/post-content";
import { PostFooter } from "@/components/post/post-footer";
import { PostHeader } from "@/components/post/post-header";
import { ProgressLink } from "@/components/ui/progress-link";
import { TPostData } from "@/types/post";
import React from "react";

const PostCard = React.forwardRef(({ postData }: { postData: TPostData }, ref: any) => {
	return (
		<ProgressLink
			ref={ref}
			href={`/post/${postData.id}`}
			className='w-full rounded-lg border p-3 hover:bg-secondary/50'>
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
		</ProgressLink>
	);
});

export { PostCard };
