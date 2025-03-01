"use client";

import { ActionResponse, SortType } from "@/actions/grpc/_utils";
import { SortBy, TSortItem } from "@/components/_shared/sort-by";
import { Spinner } from "@/components/_shared/spinner";
import { Post } from "@/components/post";
import { PostData } from "@/grpc/protobuf/types";
import { useOnScrollIn } from "@/hooks/use-on-scroll-in";
import { cn } from "@/lib/utils";
import useProgressStore from "@/stores/progress-store";
import React, { useEffect, useRef, useState } from "react";

const arr: TSortItem[] = [
	{ label: "New", value: "new" },
	{ label: "Top", value: "top" },
	{ label: "Hot", value: "hot" },
];

export const PostScroller = ({
	action,
	serverLoadedPosts,
	label,
	sort = true,
	clipContent = false,
	ref,
	className,
	...attribute
}: {
	action: (
		sort: SortType,
		limit: number,
		offset: number,
	) => Promise<ActionResponse<PostData[]>>;
	serverLoadedPosts?: PostData[];
	label?: React.ReactElement;
	sort?: boolean;
	clipContent?: boolean;
	ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLElement>) => {
	const [posts, setPosts] = useState<PostData[]>(serverLoadedPosts || []);
	const [sortedState, setSortedState] = useState<TSortItem>(arr[0]);
	const [offset, setOffset] = useState<number>(serverLoadedPosts?.length || 0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [lastComponentRef, hasIntersected] = useOnScrollIn();
	const updateProgress = useProgressStore.use.update();
	const resetProgress = useProgressStore.use.reset();
	const mountedFirstTime = useRef(true);

	useEffect(() => {
		if (hasIntersected && hasMore && !isLoading) {
			setIsLoading(true);
			action(sortedState.value, 3, offset)
				.then((res) => {
					if (res.error) {
						throw res.error;
					}
					return res.data!;
				})
				.then((more) => {
					if (more.length === 0) {
						setHasMore(false);
						return;
					}
					setPosts((pre) => [...pre, ...more]);
					setOffset((pre) => pre + more.length);
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [hasIntersected, hasMore]);

	useEffect(() => {
		if (mountedFirstTime.current) {
			mountedFirstTime.current = false;
			return;
		}
		setIsLoading(true);
		setOffset(0);
		setHasMore(true);
		updateProgress(50);
		action(sortedState.value, 3, offset)
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res.data!;
			})
			.then((posts) => {
				if (posts.length === 0) {
					setHasMore(false);
					return;
				}
				setPosts(posts);
				setOffset((pre) => pre + posts.length);
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setIsLoading(false);
				updateProgress(100);
				setTimeout(() => {
					resetProgress();
				}, 300);
			});
	}, [sortedState]);

	return (
		<div
			className={cn("flex flex-col", className)}
			{...attribute}
			ref={ref}>
			<div className='flex items-center gap-3 py-2'>
				{label}
				{sort && (
					<SortBy
						state={sortedState}
						setState={setSortedState}
						arr={arr}
					/>
				)}
			</div>
			<div className='flex flex-col space-y-3'>
				{posts.map((p) => (
					<Post
						key={p.id}
						className='rounded-lg border p-3'
						postData={p}
						clipContent={clipContent}
					/>
				))}
			</div>
			{isLoading && hasMore && (
				<div className='my-5 h-12 w-full'>
					<Spinner />
				</div>
			)}
			{!hasMore && (
				<div className='my-5 grid w-full place-items-center text-sm text-muted-foreground'>
					<p>There are no posts left.</p>
				</div>
			)}
			<div
				className='h-1 w-full'
				ref={lastComponentRef}></div>
		</div>
	);
};
