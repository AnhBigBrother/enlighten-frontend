import React from "react";
import { TPostData } from "@/types/post";
import { HomeClient } from "@/components/home-client";
import { BACKEND_DOMAIN } from "@/constants";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
	const serverLoadedPosts: TPostData[] = await fetch(
		`${BACKEND_DOMAIN}/api/v1/post?sort=new&limit=5&offset=0`,
	)
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return notFound();
		});

	return <HomeClient serverLoadedPosts={serverLoadedPosts || []} />;
}
