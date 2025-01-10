"use client";

import { ProgressLink } from "@/components/_shared/progress-link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useInfinityScroll } from "@/hooks/use-infinity-scroll";
import { cn } from "@/lib/utils";
import { TAuthor } from "@/types/user";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export const UserHorizontalScroller = ({
	label,
	className,
	ref,
	...attributes
}: {
	label?: React.ReactElement;
	ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLElement>) => {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [isOverflowed, setIsOverflowed] = useState<boolean>(false);
	const [authors, lastAuthorRef, isLoadingAuthor] = useInfinityScroll<TAuthor>(
		"api/v1/users/all",
		5,
		[],
	);

	useEffect(() => {
		if (
			scrollAreaRef.current &&
			scrollAreaRef.current.clientWidth < scrollAreaRef.current.scrollWidth
		) {
			setIsOverflowed(true);
		}
	}, [authors]);

	const handleScroll = (offset: number) => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollLeft += offset;
		} else {
			setIsOverflowed(false);
		}
	};

	return (
		<div
			className={cn("z-0 flex w-full flex-col gap-2", className)}
			ref={ref}
			{...attributes}>
			{label}
			<div className='relative h-fit w-full rounded-lg'>
				{isOverflowed && (
					<>
						<span
							className='absolute left-0 top-0 z-10 flex h-24 w-16 cursor-pointer items-center justify-start rounded-l-lg bg-gradient-to-r from-secondary/100 via-secondary/45 to-secondary/0 px-2 text-muted-foreground hover:w-20 hover:via-secondary/60 hover:text-primary sm:h-36'
							onClick={() => handleScroll(-540)}>
							<ChevronLeft />
						</span>
						<span
							className='absolute right-0 top-0 z-10 flex h-24 w-16 cursor-pointer items-center justify-end rounded-r-lg bg-gradient-to-l from-secondary/100 via-secondary/45 to-secondary/0 px-2 text-muted-foreground hover:w-20 hover:via-secondary/60 hover:text-primary sm:h-36'
							onClick={() => handleScroll(540)}>
							<ChevronRight />
						</span>
					</>
				)}
				<div
					className='no-scrollbar flex w-full items-center justify-start gap-x-5 overflow-auto scroll-smooth rounded-lg'
					ref={scrollAreaRef}>
					{authors.map((a, i) =>
						i < authors.length - 1 ? (
							<ProgressLink
								href={`/user/${a.id}`}
								key={a.id}>
								<Avatar className='h-24 w-24 rounded-lg sm:h-36 sm:w-36'>
									<AvatarImage src={a.image}></AvatarImage>
									<AvatarFallback>
										<User className='h-full w-full bg-accent p-2' />
									</AvatarFallback>
								</Avatar>
								<h3 className='mt-2 w-24 truncate px-2 text-center font-bold sm:w-36'>
									{a.name}
								</h3>
							</ProgressLink>
						) : (
							<ProgressLink
								href={`/user/${a.id}`}
								key={a.id}
								ref={lastAuthorRef}>
								<Avatar className='h-24 w-24 rounded-lg sm:h-36 sm:w-36'>
									<AvatarImage src={a.image}></AvatarImage>
									<AvatarFallback>
										<User className='h-full w-full bg-accent p-2' />
									</AvatarFallback>
								</Avatar>
								<h3 className='mt-2 w-24 truncate px-2 text-center font-bold sm:w-36'>
									{a.name}
								</h3>
							</ProgressLink>
						),
					)}
					{isLoadingAuthor && (
						<div>
							<div className='h-24 w-24 animate-pulse rounded-lg bg-secondary sm:h-36 sm:w-36'></div>
							<div className='mx-2 mt-2 h-6 animate-pulse rounded-full bg-secondary'></div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
