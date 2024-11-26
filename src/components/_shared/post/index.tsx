import { PostContent } from "@/components/_shared/post/post-content";
import { Discussion } from "@/components/_shared/post/post-discussion";
import { PostHeader } from "@/components/_shared/post/post-header";
import React from "react";

const Post = () => {
	return (
		<div className='rounded-lg border p-3'>
			<div className='flex w-full flex-col'>
				<PostHeader />
				<PostContent />
			</div>
			<Discussion
				linkPost=''
				disableComment
			/>
		</div>
	);
};

export { Post };
