"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TComment } from "@/types/comment";
import {
	ArrowBigDown,
	ArrowBigUp,
	CircleMinus,
	CirclePlus,
	MessageSquare,
	User,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { _get, _post } from "@/lib/fetch";
import { useToast } from "@/hooks/use-toast";
import useUserStore from "@/stores/user-store";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/_shared/spinner";
import { useOnScrollIn } from "@/hooks/use-on-scroll-in";

const CommentReply = ({
	postId,
	replyData,
	setIsReplyOpen,
}: {
	postId: string;
	replyData: TComment;
	setIsReplyOpen: Dispatch<SetStateAction<boolean>>;
}) => {
	const { toast } = useToast();
	const [hasVoted, setHasVoted] = useState<"up" | "none" | "down">("none");
	const [upVoted, setUpVoted] = useState<number>(replyData.up_voted);
	const [downVoted, setDownVoted] = useState<number>(replyData.down_voted);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const user = useUserStore.use.user();
	useEffect(() => {
		if (user) {
			_get(`/api/v1/post/${postId}/comment/${replyData.id}/checkvoted`)
				.then(({ voted }) => {
					setHasVoted(voted);
				})
				.catch((err) => {
					console.error(err);
					setHasVoted("none");
				});
		}
	}, [user]);

	const handleUpVoteComment = () => {
		setIsLoading(true);
		_post(`api/v1/post/${postId}/comment/${replyData.id}/upvote`)
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
				toast({
					title: "Error",
					description: err.error || "Error when upvoting comment.",
					variant: "destructive",
				});
				console.error(err);
			})
			.finally(() => setIsLoading(true));
	};
	const handleDownVoteComment = () => {
		setIsLoading(true);
		_post(`api/v1/post/${postId}/comment/${replyData.id}/downvote`)
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
				toast({
					title: "Error",
					description: err.error || "Error when downvoting comment.",
					variant: "destructive",
				});
				console.error(err);
			})
			.finally(() => setIsLoading(true));
	};

	return (
		<div className='my-2 flex flex-col text-sm'>
			<div className='flex w-full flex-row items-center space-x-2'>
				<Avatar className='h-8 w-8'>
					<AvatarImage src={replyData.author_image}></AvatarImage>
					<AvatarFallback>
						<User className='h-full w-full cursor-pointer bg-accent p-2' />
					</AvatarFallback>
				</Avatar>
				<div className='flex flex-col items-start justify-center font-semibold'>
					<h4 className='font-semibold'>{replyData.author_name}</h4>
					<span className='text-xs font-light text-muted-foreground'>
						{new Date(replyData.created_at).toLocaleTimeString("en-us", {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</div>
			</div>
			<div className='ml-9'>
				<p className='mt-2 flex flex-col whitespace-pre-line'>{replyData.comment}</p>
				<div className='mt-1 flex flex-row gap-3'>
					<div className='flex flex-row gap-2'>
						<button
							className={cn(
								"flex h-fit flex-row items-center justify-center rounded-lg py-1 hover:text-blue-500 disabled:text-muted-foreground",
								{
									"text-blue-500": hasVoted === "up",
								},
							)}
							disabled={isLoading}
							onClick={() => handleUpVoteComment()}>
							<ArrowBigUp className='mr-1 h-5 w-5' />
							<span>{upVoted}</span>
						</button>
						<button
							className={cn(
								"flex h-fit flex-row items-center justify-center rounded-lg py-1 hover:text-blue-500 disabled:text-muted-foreground",
								{
									"text-blue-500": hasVoted === "down",
								},
							)}
							disabled={isLoading}
							onClick={() => handleDownVoteComment()}>
							<ArrowBigDown className='mr-1 h-5 w-5' />
							<span>{downVoted}</span>
						</button>
					</div>
					<button
						className='flex h-fit flex-row items-center justify-center rounded-lg py-1 hover:text-blue-500'
						onClick={() => setIsReplyOpen((pre) => !pre)}>
						<MessageSquare className='mr-2 h-4 w-4' />
						<span>Reply</span>
					</button>
				</div>
			</div>
		</div>
	);
};

const ReplyWritter = ({
	postId,
	parentCommentId,
	setReplies,
	setIsReplyOpen,
}: {
	postId: string;
	parentCommentId: string;
	setIsReplyOpen: Dispatch<SetStateAction<boolean>>;
	setReplies: Dispatch<SetStateAction<TComment[]>>;
}) => {
	const user = useUserStore.use.user();
	const { toast } = useToast();
	const [reply, setReply] = useState<string>("");

	const handleSubmitComment = (e: React.MouseEvent) => {
		e.preventDefault();
		_post(`api/v1/post/${postId}/comment/${parentCommentId}/reply`, {
			body: {
				reply: reply,
			},
		})
			.then((com: TComment) => {
				setReplies((pre) => {
					const newCom: TComment = {
						id: com.id,
						author_email: user!.email,
						author_id: com.author_id,
						author_image: user!.image,
						author_name: user!.name,
						comment: com.comment,
						created_at: com.created_at,
						down_voted: 0,
						up_voted: 0,
						parent_comment_id: null,
						post_id: postId,
					};
					return [newCom, ...pre];
				});
				setReply("");
				setIsReplyOpen(false);
				toast({
					title: "Success",
					description: "Comment created.",
				});
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.error || "Error when create post's comments.",
					variant: "destructive",
				});
			});
	};
	return (
		<form className='mb-5 w-full rounded-lg border p-2 text-sm outline-1 outline-primary focus-within:outline'>
			<textarea
				className='h-10 w-full resize-none bg-transparent outline-none'
				rows={1}
				value={reply}
				placeholder='Write your reply...'
				onChange={(e) => setReply(e.target.value)}
			/>
			<div className='flex w-full flex-row items-center justify-end space-x-3'>
				<Button
					variant='secondary'
					className='rounded-xl'
					type='button'
					onClick={() => setIsReplyOpen(false)}>
					Cancel
				</Button>
				<Button
					className='rounded-xl'
					type='submit'
					onClick={(e) => handleSubmitComment(e)}>
					Comment
				</Button>
			</div>
		</form>
	);
};

const Comment = ({ commentData, postId }: { commentData: TComment; postId: string }) => {
	const [hasVoted, setHasVoted] = useState<"up" | "none" | "down">("none");
	const [upVoted, setUpVoted] = useState<number>(commentData.up_voted);
	const [downVoted, setDownVoted] = useState<number>(commentData.down_voted);
	const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
	const [showReplies, setShowReplies] = useState<boolean>(false);
	const [isLoadingReplies, setIsLoadingReplies] = useState<boolean>(false);
	const [isVoting, setIsVoting] = useState<boolean>(false);
	const [replies, setReplies] = useState<TComment[]>([]);
	const user = useUserStore.use.user();
	const { toast } = useToast();
	useEffect(() => {
		if (user) {
			_get(`/api/v1/post/${postId}/comment/${commentData.id}/checkvoted`)
				.then(({ voted }) => {
					setHasVoted(voted);
				})
				.catch((err) => {
					console.error(err);
					setHasVoted("none");
				});
		}
	}, [user]);

	useEffect(() => {
		if (showReplies) {
			setIsLoadingReplies(true);
			_get(`/api/v1/post/${postId}/comment/${commentData.id}`)
				.then((reps: TComment[]) => {
					setReplies(reps);
				})
				.catch((err) => console.error(err))
				.finally(() => setIsLoadingReplies(false));
		}
	}, [showReplies]);

	const handleUpVoteComment = () => {
		setIsVoting(true);
		_post(`api/v1/post/${postId}/comment/${commentData.id}/upvote`)
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
				toast({
					title: "Error",
					description: err.error || "Error when upvoting comment.",
					variant: "destructive",
				});
				console.error(err);
			})
			.finally(() => setIsVoting(false));
	};
	const handleDownVoteComment = () => {
		setIsVoting(true);
		_post(`api/v1/post/${postId}/comment/${commentData.id}/downvote`)
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
				toast({
					title: "Error",
					description: err.error || "Error when downvoting comment.",
					variant: "destructive",
				});
				console.error(err);
			})
			.finally(() => setIsVoting(false));
	};

	return (
		<div className='flex flex-col text-sm'>
			<div className='flex w-full flex-row items-center space-x-2'>
				<Avatar className='h-8 w-8'>
					<AvatarImage src={commentData.author_image}></AvatarImage>
					<AvatarFallback>
						<User className='h-full w-full cursor-pointer bg-accent p-2' />
					</AvatarFallback>
				</Avatar>
				<div className='flex flex-col items-start justify-center font-semibold'>
					<h4 className='font-semibold'>{commentData.author_name}</h4>
					<span className='text-xs font-light text-muted-foreground'>
						{new Date(commentData.created_at).toLocaleTimeString("en-us", {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>
				</div>
			</div>
			<div className='ml-9'>
				<p className='mt-2 flex flex-col whitespace-pre-line'>{commentData.comment}</p>
				<div className='mt-1 flex flex-row items-center gap-3'>
					<div className='flex flex-row gap-2'>
						<button
							className={cn(
								"flex h-fit flex-row items-center justify-center rounded-lg py-1 hover:text-blue-500 disabled:text-muted-foreground",
								{
									"text-blue-500": hasVoted === "up",
								},
							)}
							disabled={isVoting}
							onClick={() => handleUpVoteComment()}>
							<ArrowBigUp className='mr-1 h-5 w-5' />
							<span>{upVoted}</span>
						</button>
						<button
							className={cn(
								"flex h-fit flex-row items-center justify-center rounded-lg py-1 hover:text-blue-500 disabled:text-muted-foreground",
								{
									"text-blue-500": hasVoted === "down",
								},
							)}
							disabled={isVoting}
							onClick={() => handleDownVoteComment()}>
							<ArrowBigDown className='mr-1 h-5 w-5' />
							<span>{downVoted}</span>
						</button>
					</div>
					<button
						className='flex h-fit flex-row items-center justify-center rounded-lg py-1 hover:text-blue-500'
						onClick={() => {
							if (!isReplyOpen) {
								setShowReplies(true);
							}
							setIsReplyOpen((pre) => !pre);
						}}>
						<MessageSquare className='mr-2 h-4 w-4' />
						<span>Reply</span>
					</button>
					<button
						className='flex h-fit flex-row items-center justify-center rounded-lg py-1 hover:text-blue-500'
						onClick={() => setShowReplies((pre) => !pre)}>
						{showReplies ? (
							<>
								<CircleMinus className='mr-2 h-4 w-4' />
								<span className='hidden sm:block'>Close replies</span>
							</>
						) : (
							<>
								<CirclePlus className='mr-2 h-4 w-4' />
								<span className='hidden sm:block'>View replies</span>
							</>
						)}
					</button>
				</div>
				<div className='mt-3 flex flex-col'>
					{isReplyOpen && (
						<ReplyWritter
							postId={postId}
							parentCommentId={commentData.id}
							setReplies={setReplies}
							setIsReplyOpen={setIsReplyOpen}
						/>
					)}
					{showReplies && (
						<div className='flex flex-col'>
							{isLoadingReplies ? (
								<div className='h-8 w-12'>
									<Spinner />
								</div>
							) : (
								replies.map((rep) => (
									<CommentReply
										postId={postId}
										replyData={rep}
										setIsReplyOpen={setIsReplyOpen}
										key={rep.id}
									/>
								))
							)}
							{replies.length === 0 && !isLoadingReplies && (
								<p className='italic text-muted-foreground'>No one replied yet.</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const CommentWritter = ({
	postId,
	setComments,
}: {
	postId: string;
	setComments: Dispatch<SetStateAction<TComment[]>>;
}) => {
	const user = useUserStore.use.user();
	const { toast } = useToast();
	const [comment, setComment] = useState<string>("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	useEffect(() => {
		textareaRef.current!.style.height = "64px";
		const scrollHeight = textareaRef.current!.scrollHeight;
		textareaRef.current!.style.height = scrollHeight + "px";
	}, [comment]);

	const handleSubmitComment = (e: React.MouseEvent) => {
		e.preventDefault();
		_post(`api/v1/post/${postId}/comment`, {
			body: {
				comment: comment,
			},
		})
			.then((com: TComment) => {
				setComments((pre) => {
					const newCom: TComment = {
						id: com.id,
						author_email: user!.email,
						author_id: com.author_id,
						author_image: user!.image,
						author_name: user!.name,
						comment: com.comment,
						created_at: com.created_at,
						down_voted: 0,
						up_voted: 0,
						parent_comment_id: null,
						post_id: postId,
					};
					return [newCom, ...pre];
				});
				setComment("");
				toast({
					title: "Success",
					description: "Comment created.",
				});
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.error || "Error when create post's comments.",
					variant: "destructive",
				});
			});
	};

	return (
		<form className='w-full rounded-lg border p-2 text-sm outline-1 outline-primary focus-within:outline'>
			<textarea
				ref={textareaRef}
				className='h-16 w-full resize-none bg-transparent outline-none'
				value={comment}
				placeholder='Write your comment...'
				onChange={(e) => setComment(e.target.value)}
			/>
			<div className='flex w-full flex-row items-center justify-end space-x-3'>
				<Button
					variant='secondary'
					className='rounded-xl'
					type='button'
					onClick={() => setComment("")}>
					Cancel
				</Button>
				<Button
					type='submit'
					className='rounded-xl'
					onClick={(e) => handleSubmitComment(e)}>
					Comment
				</Button>
			</div>
		</form>
	);
};

const PostComment = ({ postId }: { postId: string }) => {
	const { toast } = useToast();
	const [comments, setComments] = useState<TComment[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [offset, setOffset] = useState<number>(0);
	const [lastComponentRef, hasIntersected] = useOnScrollIn();

	useEffect(() => {
		if (hasIntersected && hasMore && !isLoading) {
			setIsLoading(true);
			_get(`/api/v1/post/${postId}/comment`, {
				searchParams: {
					offset: `${offset}`,
					limit: "5",
				},
			})
				.then((data: TComment[]) => {
					if (data.length === 0) {
						setHasMore(false);
						return;
					}
					setComments((pre) => [...pre, ...data]);
					setOffset((pre) => pre + data.length);
				})
				.catch((err) => {
					console.error(err);
					toast({
						title: "Error",
						description: "Error when loading post's comments.",
						variant: "destructive",
					});
				})
				.finally(() => setIsLoading(false));
		}
	}, [hasIntersected]);
	return (
		<div className='flex w-full flex-col py-5'>
			<CommentWritter
				postId={postId}
				setComments={setComments}
			/>
			<h2 className='mt-10 text-xl font-bold'>Comments</h2>
			<div className='mt-5 flex flex-col gap-5'>
				{comments.map((c) => (
					<Comment
						postId={postId}
						commentData={c}
						key={c.id}
					/>
				))}
				{!hasMore && !isLoading && comments.length === 0 && (
					<p className='text-sm italic text-muted-foreground'>
						There was no comment on this post yet
					</p>
				)}
				{isLoading && hasMore && (
					<div className='h-12 w-full'>
						<Spinner />
					</div>
				)}
			</div>
			<div
				className='h-1 w-full'
				ref={lastComponentRef}></div>
		</div>
	);
};

export { PostComment };
