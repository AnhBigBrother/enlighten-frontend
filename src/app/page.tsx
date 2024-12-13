import React from "react";
import { TPostData } from "@/types/post";
import { HomeClient } from "@/components/home-client";
import { Fetch } from "@/actions/fetch";

export const dynamic = "force-dynamic";

export default async function Home() {
	const serverLoadedPosts: TPostData[] = await Fetch("api/v1/post", "GET", {
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
