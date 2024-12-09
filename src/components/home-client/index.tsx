"use client";

import { SortBy, TSortItem } from "@/components/_shared/sort-by";
import { Spinner } from "@/components/_shared/spinner";
import { PostCard } from "@/components/post/post-card";
import { useOnScrollIn } from "@/hooks/use-on-scroll-in";
import { _get } from "@/lib/fetch";
import { TPostData } from "@/types/post";
import React, { useEffect, useState } from "react";

const arr: TSortItem[] = [
	{ label: "New", value: "new" },
	{ label: "Top", value: "top" },
	{ label: "Hot", value: "hot" },
];

export const HomeClient = ({ serverLoadedPosts }: { serverLoadedPosts: TPostData[] }) => {
	const [posts, setPosts] = useState<TPostData[]>(serverLoadedPosts);
	const [sortedState, setSortedState] = useState<TSortItem>(arr[0]);
	const [offset, setOffset] = useState<number>(5);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [lastComponentRef, hasIntersected] = useOnScrollIn();

	useEffect(() => {
		if (hasIntersected && hasMore && !isLoading) {
			setIsLoading(true);
			_get("/post", {
				searchParams: {
					sort: sortedState.value,
					limit: "5",
					offset: `${offset}`,
				},
			})
				.then((more: TPostData[]) => {
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
		setIsLoading(true);
		setOffset(0);
		setHasMore(true);
		_get("/post", {
			searchParams: {
				sort: sortedState.value,
				limit: "5",
				offset: `0`,
			},
		})
			.then((posts: TPostData[]) => {
				setPosts(posts);
				setOffset((pre) => pre + posts.length);
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [sortedState]);

	return (
		<div className='flex flex-col'>
			<SortBy
				state={sortedState}
				setState={setSortedState}
				arr={arr}
			/>
			<div className='flex flex-col space-y-3'>
				{posts.map((p) => (
					<PostCard
						postData={p}
						key={p.id}
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
