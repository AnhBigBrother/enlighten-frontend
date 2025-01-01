"use client";

import { PostComment } from "@/components/post/post-comment";
import useRecentStore, { TRecent } from "@/stores/recent-store";
import { useEffect } from "react";

export const PostAdditional = ({ data }: { data: TRecent }) => {
	const addRecent = useRecentStore.use.add();
	useEffect(() => {
		addRecent(data);
	}, []);
	return <PostComment postId={data.id} />;
};
