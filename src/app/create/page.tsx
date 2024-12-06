import CreatePost from "@/components/create/create-post";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Enlighten | Create",
};

const Create = async () => {
	return (
		<div className='flex w-full flex-col px-2 md:px-4'>
			<h1 className='py-10 text-2xl font-bold'>Create post</h1>
			<CreatePost />
		</div>
	);
};

export default Create;
