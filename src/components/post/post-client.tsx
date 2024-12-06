"use client";

import useRecentStore, { TRecent } from "@/stores/recent-store";
import { useEffect } from "react";

export const PostClient = ({ data }: { data: TRecent }) => {
	const addRecent = useRecentStore.use.add();
	useEffect(() => {
		addRecent(data);
	}, []);
	return null;
};
