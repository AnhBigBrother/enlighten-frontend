"use client";

import { useToast } from "@/hooks/use-toast";
import { _delete, _get, _post } from "@/lib/fetch";
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
	const [isVoting, setIsVoting] = useState<boolean>(false);
	const [hasVoted, setHasVoted] = useState<"up" | "down" | "none">("none");
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [hasSaved, setHasSaved] = useState<boolean>(false);
	const [upVoteCount, setUpVoteCount] = useState<number>(up_voted);
	const [downVoteCount, setDownVoteCount] = useState<number>(down_voted);
	const router = useRouter();
	const { toast } = useToast();
	useEffect(() => {
		if (user) {
			_get(`/api/v1/posts/${id}/check`)
				.then(({ saved, voted }) => {
					setHasVoted(voted);
					setHasSaved(saved);
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
		setIsVoting(true);
		_post(`api/v1/posts/${id}/vote/up`)
			.then(() => {
				if (hasVoted === "up") {
					setHasVoted("none");
					setUpVoteCount((pre) => pre - 1);
				} else {
					if (hasVoted === "down") {
						setDownVoteCount((pre) => pre - 1);
					}
					setHasVoted("up");
					setUpVoteCount((pre) => pre + 1);
				}
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.error || "Error when upvoting post.",
					variant: "destructive",
				});
			})
			.finally(() => setIsVoting(false));
	};
	const handleClickDownVote = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsVoting(true);
		_post(`api/v1/posts/${id}/vote/down`)
			.then(() => {
				if (hasVoted === "down") {
					setHasVoted("none");
					setDownVoteCount((pre) => pre - 1);
				} else {
					if (hasVoted === "up") {
						setUpVoteCount((pre) => pre - 1);
					}
					setHasVoted("down");
					setDownVoteCount((pre) => pre + 1);
				}
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.error || "Error when downvoting post.",
					variant: "destructive",
				});
			})
			.finally(() => setIsVoting(false));
	};
	const handleClickSave = () => {
		setIsSaving(true);
		_post(`/api/v1/posts/${id}/save`)
			.then(() => {
				toast({
					title: "Success",
					description: "Post has been saved",
				});
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: "Cannot saved post",
					variant: "destructive",
				});
			})
			.finally(() => {
				setHasSaved(true);
				setIsSaving(false);
			});
	};
	const handleClickUnSave = () => {
		setIsSaving(true);
		_delete(`/api/v1/posts/${id}/save`)
			.then(() => {
				toast({
					title: "Success",
					description: "Post has been unsaved",
				});
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: "Cannot unsaved post",
					variant: "destructive",
				});
			})
			.finally(() => {
				setHasSaved(false);
				setIsSaving(false);
			});
	};
	const handleClickShare = () => {};
	return (
		<div className='flex w-full flex-col space-y-2'>
			<div className='flex h-9 w-full flex-row items-center justify-start space-x-2 text-sm'>
				<div className='flex h-full flex-row items-center rounded-xl border'>
					<button
						title='up vote'
						disabled={isVoting}
						onClick={(e) => handleClickUpVote(e)}
						className={cn(
							"flex h-full flex-row items-center space-x-1 rounded-xl px-2 hover:bg-accent hover:text-primary disabled:text-muted-foreground",
							{
								"bg-secondary text-primary": user && hasVoted === "up",
							},
						)}>
						<ArrowBigUp className='h-5 w-5' />
						<span>{upVoteCount}</span>
					</button>
					<button
						title='down vote'
						disabled={isVoting}
						onClick={(e) => handleClickDownVote(e)}
						className={cn(
							"flex h-full flex-row items-center space-x-1 rounded-xl px-2 hover:bg-accent hover:text-primary disabled:text-muted-foreground",
							{
								"bg-secondary text-primary": user && hasVoted === "down",
							},
						)}>
						<ArrowBigDown className='h-5 w-5' />
						<span>{downVoteCount}</span>
					</button>
				</div>
				<button
					title='comment'
					onClick={() => router.push(`/post/${id}`)}
					className='flex h-full flex-row items-center space-x-1 rounded-xl border px-2 hover:bg-accent hover:text-primary'>
					<MessageSquare className='h-5 w-5' />
					<span>{comments_count}</span>
				</button>
				<button
					disabled={isSaving}
					title={hasSaved ? "saved" : "save"}
					onClick={hasSaved ? () => handleClickUnSave() : () => handleClickSave()}
					className={cn(
						"flex h-full flex-row items-center space-x-1 rounded-xl border px-2 hover:bg-accent hover:text-primary disabled:text-muted-foreground",
						hasSaved && "bg-secondary text-primary",
					)}>
					<Bookmark className='h-5 w-5' />
					<span className='hidden sm:inline-block'>Save</span>
				</button>
				<button
					title='share'
					onClick={() => handleClickShare()}
					className='flex h-full flex-row items-center space-x-1 rounded-xl border px-2 hover:bg-accent hover:text-primary'>
					<PiShareFat className='h-5 w-5' />
					<span className='hidden sm:inline-block'>Share</span>
				</button>
			</div>
		</div>
	);
};

export { PostFooter };
