import React from "react";
import { PostCard } from "@/components/post/post-card";
import { _get } from "@/lib/fetch";
import { notFound } from "next/navigation";
import { SortBy } from "@/components/_shared/sort-by";
import { TPostData } from "@/types/post";

export default async function Home() {
	const posts: TPostData[] = await _get("/post").catch((error) => {
		return notFound();
	});
	return (
		<div className='flex flex-col'>
			<SortBy />
			<div className='flex flex-col space-y-3'>
				{posts.map((p, idx) => (
					<PostCard
						postData={p}
						key={idx}
					/>
				))}
			</div>
		</div>
	);
}
