import React from "react";
import { Post } from "@/components/_shared/post";
import { SortContents } from "@/components/_shared/sort-contents";

export default function Home() {
	return (
		<div className='flex flex-col'>
			<SortContents />
			<div className='flex flex-col space-y-3'>
				<Post />
				<Post />
			</div>
		</div>
	);
}
