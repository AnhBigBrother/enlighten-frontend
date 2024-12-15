import React from "react";
import { TPostData } from "@/types/post";
import { HomeClient } from "@/components/home-client";
import { _get } from "@/lib/fetch";

export const dynamic = "force-dynamic";

export default async function Home() {
	const serverLoadedPosts: TPostData[] = await _get("api/v1/post", {
		searchParams: {
			sort: "new",
			limit: "5",
			offset: "0",
		},
	}).catch((err) => {
		console.log(err);
	});

	return <HomeClient serverLoadedPosts={serverLoadedPosts || []} />;
}
