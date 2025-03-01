"use client";

import {
	CheckPostInteracted,
	DownVotePost,
	SavePost,
	UnSavePost,
	UpVotePost,
} from "@/actions/grpc/post";
import { Voted } from "@/grpc/protobuf/types";
import { useToast } from "@/hooks/use-toast";
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
	created_at: number;
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
			CheckPostInteracted(id)
				.then((res) => {
					if (res.error) {
						throw res.error;
					}
					return res.data!;
				})
				.then(({ voted, saved }) => {
					setHasSaved(saved);
					if (voted === Voted.UP) {
						setHasVoted("up");
					} else if (voted === Voted.DOWN) {
						setHasVoted("down");
					} else {
						setHasVoted("none");
					}
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
		UpVotePost(id)
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res.data!;
			})
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
		DownVotePost(id)
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res.data!;
			})
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
		SavePost(id)
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res.data!;
			})
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
		UnSavePost(id)
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res.data!;
			})
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
								"text-primary": user && hasVoted === "up",
							},
						)}>
						<ArrowBigUp
							className={cn("h-5 w-5", {
								"fill-primary": user && hasVoted === "up",
							})}
						/>
						<span>{upVoteCount}</span>
					</button>
					<button
						title='down vote'
						disabled={isVoting}
						onClick={(e) => handleClickDownVote(e)}
						className={cn(
							"flex h-full flex-row items-center space-x-1 rounded-xl px-2 hover:bg-accent hover:text-primary disabled:text-muted-foreground",
							{
								"text-primary": user && hasVoted === "down",
							},
						)}>
						<ArrowBigDown
							className={cn("h-5 w-5", {
								"fill-primary": user && hasVoted === "down",
							})}
						/>
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
						user && hasSaved && "text-primary",
					)}>
					<Bookmark className={cn("h-5 w-5", user && hasSaved && "fill-primary")} />
					<span className='hidden sm:inline-block'>{hasSaved ? "Saved" : "Save"}</span>
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
