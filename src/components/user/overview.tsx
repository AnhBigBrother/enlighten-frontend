"use client";

import { CheckUserFollowed, FollowUser, UnFollowUser } from "@/actions/grpc/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetUserOverviewResponse } from "@/grpc/protobuf/public_service";
import { useToast } from "@/hooks/use-toast";
import useUserStore from "@/stores/user-store";
import {
	NotebookText,
	Rss,
	ShieldCheck,
	ThumbsDown,
	ThumbsUp,
	User,
	UserCheck,
	UserMinus,
	UserPlus,
	UserRoundCheck,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export const UserOverview = ({ userOverview }: { userOverview: GetUserOverviewResponse }) => {
	const user = useUserStore.use.user();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFollowed, setIsFollowed] = useState(false);

	useEffect(() => {
		if (user) {
			CheckUserFollowed(userOverview.id)
				.then((res) => {
					if (res.error) {
						throw res.error;
					}
					return res.data!;
				})
				.then((fol) => {
					setIsFollowed(true);
				})
				.catch((err) => setIsFollowed(false));
		}
	}, [user]);

	const handleFollow = () => {
		setIsLoading(true);
		FollowUser(userOverview.id)
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res.data!;
			})
			.then(() => {
				setIsFollowed(true);
				toast({
					title: "Success",
					description: `You have been followed ${userOverview.name}`,
				});
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.error || "Cannot follows",
					variant: "destructive",
				});
			})
			.finally(() => setIsLoading(false));
	};
	const handleUnfollow = () => {
		setIsLoading(true);
		UnFollowUser(userOverview.id)
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res.data!;
			})
			.then(() => {
				setIsFollowed(false);
				toast({
					title: "Success",
					description: `You have been unfollowed ${userOverview.name}`,
				});
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.error || "Something went wrong, try latter!",
					variant: "destructive",
				});
			})
			.finally(() => setIsLoading(false));
	};
	return (
		<>
			<div className='flex w-full flex-row gap-5'>
				<div className='aspect-square h-fit w-1/4 min-w-32 max-w-48 flex-shrink-0'>
					<Avatar className='h-full w-full rounded-lg border'>
						<AvatarImage src={userOverview.image}></AvatarImage>
						<AvatarFallback>
							<User className='h-full w-full bg-gradient-to-br from-secondary to-background p-2' />
						</AvatarFallback>
					</Avatar>
				</div>
				<div className='flex flex-grow flex-col pt-2'>
					<div className='flex flex-row flex-wrap justify-between gap-x-5 gap-y-2'>
						<div className='flex max-w-48 flex-col sm:max-w-full'>
							<h2 className='text-xl font-bold '>{userOverview.name}</h2>
							<p className='truncate text-sm text-muted-foreground'>{userOverview.email}</p>
						</div>
						{isFollowed ? (
							<DropdownMenu>
								<DropdownMenuTrigger className='mr-6 flex h-fit w-fit items-center space-x-2 rounded-md border p-2 px-3 text-sm italic text-muted-foreground'>
									<UserCheck className='h-4 w-4' />
									<span className='text-center'>Followed</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align='end'
									className='h-fit w-fit min-w-0'>
									<DropdownMenuItem
										className='cursor-pointer'
										onClick={() => handleUnfollow()}>
										<UserMinus />
										<span className='text-center'>Unfollow</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button
								className='mr-6 w-fit'
								disabled={isLoading}
								onClick={() => handleFollow()}>
								<UserPlus />
								<span className='text-center'>Folllow</span>
							</Button>
						)}
					</div>
					<p className='my-3 text-sm italic text-muted-foreground sm:text-base'>
						{userOverview.bio}
					</p>
					<div className='my-1 hidden gap-6 text-sm text-muted-foreground sm:flex'>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='Joined date'>
							<ShieldCheck className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>
								{new Date(userOverview.created_at).toLocaleDateString("en-us", {
									dateStyle: "medium",
								})}
							</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='total posts'>
							<NotebookText className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{userOverview.total_posts} posts</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='follower'>
							<UserRoundCheck className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{userOverview.follower}</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='following'>
							<Rss className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{userOverview.following}</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='total upvote'>
							<ThumbsUp className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{userOverview.total_upvote}</span>
						</div>
						<div
							className='flex w-fit flex-col items-center gap-y-2'
							title='total downvote'>
							<ThumbsDown className='h-7 w-7 stroke-[1.5]' />
							<span className='text-center'>{userOverview.total_downvote}</span>
						</div>
					</div>
				</div>
			</div>
			<div className='my-5 flex w-full justify-center gap-5 text-sm text-muted-foreground sm:hidden'>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='Joined date'>
					<ShieldCheck className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>
						{new Date(userOverview.created_at).toLocaleDateString("en-us", {
							dateStyle: "medium",
						})}
					</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='total posts'>
					<NotebookText className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{userOverview.total_posts} posts</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='follower'>
					<UserRoundCheck className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{userOverview.follower}</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='following'>
					<Rss className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{userOverview.following}</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='total upvote'>
					<ThumbsUp className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{userOverview.total_upvote}</span>
				</div>
				<div
					className='flex w-fit flex-col items-center gap-y-2'
					title='total downvote'>
					<ThumbsDown className='h-6 w-6 stroke-[1.5]' />
					<span className='text-center'>{userOverview.total_downvote}</span>
				</div>
			</div>
		</>
	);
};
