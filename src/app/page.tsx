import React from "react";
import { _get } from "@/lib/fetch";
import { TPostData } from "@/types/post";
import { HomeClient } from "@/components/home-client";

export const dynamic = "force-dynamic";

export default async function Home() {
	const serverLoadedPosts: TPostData[] = await _get("/post", {
		searchParams: {
			sort: "new",
			limit: "5",
			offset: "0",
		},
	}).catch((error) => {
		console.log(error);
	});

	console.log(serverLoadedPosts);
	return <HomeClient serverLoadedPosts={serverLoadedPosts || []} />;
}
