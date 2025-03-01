"use client";

import { ActionResponse } from "@/actions/grpc/_utils";
import { useCallback, useEffect, useRef, useState } from "react";

const useInfinityScroll = <T>(
	action: (limit: number, offset: number) => Promise<ActionResponse<T[]>>,
	limit: number,
	loadedData?: T[],
	pingState?: any,
): [T[], any, boolean, boolean] => {
	const [data, setData] = useState<T[]>(loadedData || []);
	const [offset, setOffset] = useState<number>(loadedData ? loadedData.length : 0);
	const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);

	const observer = useRef<IntersectionObserver>(null);
	const lastElementRef = useCallback(
		(node?: HTMLElement) => {
			if (isLoadingMore) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
					setIsLoadingMore(true);
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoadingMore, hasMore, pingState],
	);

	useEffect(() => {
		setData(loadedData || []);
		setOffset(loadedData ? loadedData.length : 0);
		setHasMore(true);
		setIsLoadingMore(true);
	}, [pingState]);

	useEffect(() => {
		if (isLoadingMore && hasMore) {
			action(3, offset)
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
					setData((pre) => [...pre, ...more]);
					setOffset((pre) => pre + more.length);
				})
				.catch((err) => console.error(err))
				.finally(() => setIsLoadingMore(false));
		}
	}, [isLoadingMore]);

	return [data, lastElementRef, isLoadingMore, hasMore];
};

export { useInfinityScroll };
