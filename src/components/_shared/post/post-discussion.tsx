"use client";

import React, { useState } from "react";
import {
	PiArrowFatDown,
	PiArrowFatUp,
	PiBookmarkSimple,
	PiChat,
	PiShareFat,
} from "react-icons/pi";
import { Button } from "@/components/ui/button";

const CommentSection = () => {
	const [commment, setCommment] = useState<string>("");
	return (
		<div className='w-full rounded-2xl border'>
			<textarea
				className='w-full bg-transparent px-3 py-2 outline-none'
				value={commment}
				onChange={(e) => setCommment(e.target.value)}
			/>
			<div className='flex w-full flex-row items-center justify-end space-x-3 p-2'>
				<Button
					variant='secondary'
					className='rounded-xl bg-accent'
					onClick={() => setCommment("")}>
					Cancel
				</Button>
				<Button className='rounded-xl'>Commment</Button>
			</div>
		</div>
	);
};

type DiscussionProps = {
	linkPost: string;
	disableComment?: boolean;
};

const Discussion = ({ linkPost, disableComment = false }: DiscussionProps) => {
	const [openComment, setOpenComment] = useState<boolean>(false);
	const handleClicVote = (vote: "up" | "down") => {};
	const handleopenComment = () => {
		if (disableComment) {
			document.location.href = linkPost;
			return;
		}
		setOpenComment((pre) => !pre);
	};
	const handleClickSave = () => {};
	const handleClickShare = () => {};
	return (
		<div className='flex flex-col space-y-2'>
			<div className='flex w-full flex-row items-center justify-start space-x-2 text-sm'>
				<div className='flex flex-row items-center rounded-xl border'>
					<button
						onClick={() => handleClicVote("up")}
						className='flex flex-row items-center space-x-1 rounded-xl p-2 hover:bg-accent'>
						<PiArrowFatUp className='h-5 w-5' />
						<span>10</span>
					</button>
					<button
						onClick={() => handleClicVote("down")}
						className='flex flex-row items-center space-x-1 rounded-xl p-2 hover:bg-accent'>
						<PiArrowFatDown className='h-5 w-5' />
						<span>10</span>
					</button>
				</div>
				<button
					onClick={() => handleopenComment()}
					className='flex flex-row items-center space-x-1 rounded-xl border p-2 hover:bg-accent'>
					<PiChat className='h-5 w-5' />
					<span>10</span>
				</button>
				<button
					onClick={() => handleClickSave()}
					className='flex flex-row items-center space-x-1 rounded-xl border p-2 hover:bg-accent'>
					<PiBookmarkSimple className='h-5 w-5' />
					<span className='hidden sm:inline-block'>Save</span>
				</button>
				<button
					onClick={() => handleClickShare()}
					className='flex flex-row items-center space-x-1 rounded-xl border p-2 hover:bg-accent'>
					<PiShareFat className='h-5 w-5' />
					<span className='hidden sm:inline-block'>Share</span>
				</button>
			</div>
			{!disableComment && openComment && <CommentSection />}
		</div>
	);
};

export { Discussion, CommentSection };
