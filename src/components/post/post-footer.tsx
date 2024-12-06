"use client";

import { _get, _post } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import useUserStore from "@/stores/user-store";
import { ArrowBigDown, ArrowBigUp, Bookmark, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PiShareFat } from "react-icons/pi";

type Props = {
	id: string;
	up_voted: number;
	down_voted: number;
	comments_count: number;
	created_at: string;
};

const PostFooter = ({ id, up_voted, down_voted, comments_count, created_at }: Props) => {
	const user = useUserStore.use.user();
	const [hasVoted, setHasVoted] = useState<"up" | "down" | "none">("none");
	const [upVoted, setUpVoted] = useState<number>(up_voted);
	const [downVoted, setDownVoted] = useState<number>(down_voted);
	const router = useRouter();
	useEffect(() => {
		if (user) {
			_get(`/post/${id}/checkvoted`)
				.then(({ voted }) => {
					setHasVoted(voted);
				})
				.catch((err) => {
					console.error(err);
					setHasVoted("none");
				});
		}
	}, [user]);
	const handleClickUpVote = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		_post(`/post/${id}/upvote`)
			.then(() => {
				if (hasVoted === "up") {
					setHasVoted("none");
					setUpVoted((pre) => pre - 1);
				} else {
					if (hasVoted === "down") {
						setDownVoted((pre) => pre - 1);
					}
					setHasVoted("up");
					setUpVoted((pre) => pre + 1);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};
	const handleClickDownVote = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		_post(`/post/${id}/downvote`)
			.then(() => {
				if (hasVoted === "down") {
					setHasVoted("none");
					setDownVoted((pre) => pre - 1);
				} else {
					if (hasVoted === "up") {
						setUpVoted((pre) => pre - 1);
					}
					setHasVoted("down");
					setDownVoted((pre) => pre + 1);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};
	const handleClickSave = () => {};
	const handleClickShare = () => {};
	return (
		<div className='flex w-full flex-col space-y-2'>
			<div className='flex h-9 w-full flex-row items-center justify-start space-x-2 text-sm'>
				<div className='flex h-full flex-row items-center rounded-xl border'>
					<button
						onClick={(e) => handleClickUpVote(e)}
						className={cn(
							"flex h-full flex-row items-center space-x-1 rounded-xl px-2 hover:bg-accent",
							{
								"text-blue-500": user && hasVoted === "up",
							},
						)}>
						<ArrowBigUp className='h-5 w-5' />
						<span>{upVoted}</span>
					</button>
					<button
						onClick={(e) => handleClickDownVote(e)}
						className={cn(
							"flex h-full flex-row items-center space-x-1 rounded-xl px-2 hover:bg-accent",
							{
								"text-blue-500": user && hasVoted === "down",
							},
						)}>
						<ArrowBigDown className='h-5 w-5' />
						<span>{downVoted}</span>
					</button>
				</div>
				<button
					onClick={() => router.push(`/post/${id}`)}
					className='flex h-full flex-row items-center space-x-1 rounded-xl border px-2 hover:bg-accent'>
					<MessageSquare className='h-5 w-5' />
					<span>{comments_count}</span>
				</button>
				<button
					onClick={() => handleClickSave()}
					className='flex h-full flex-row items-center space-x-1 rounded-xl border px-2 hover:bg-accent'>
					<Bookmark className='h-5 w-5' />
					<span className='hidden sm:inline-block'>Save</span>
				</button>
				<button
					onClick={() => handleClickShare()}
					className='flex h-full flex-row items-center space-x-1 rounded-xl border px-2 hover:bg-accent'>
					<PiShareFat className='h-5 w-5' />
					<span className='hidden sm:inline-block'>Share</span>
				</button>
			</div>
		</div>
	);
};

export { PostFooter };