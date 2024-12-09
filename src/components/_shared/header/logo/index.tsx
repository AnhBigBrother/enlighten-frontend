"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import {
	Bookmark,
	Grid3X3,
	House,
	Menu,
	MessageCircleMore,
	NotebookPen,
	NotebookText,
	SquareUser,
	Telescope,
	User,
} from "lucide-react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IconButton } from "@/components/ui/icon-button";
import { GiTicTacToe } from "react-icons/gi";
import { MenuGroup, MenuGroupHeader, MenuItem, MenuSeperator } from "@/components/ui/menu";
import { CollapsibleContent, CollapsibleMenu } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Logo = () => {
	const sideMenu = useRef<HTMLDivElement | null>(null);
	const toggleSideMenu = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (sideMenu.current) {
			// if (e) {
			// 	if (sideMenu.current === e.target) {
			// 		sideMenu.current.classList.toggle("hidden");
			// 		sideMenu.current.classList.toggle("block");
			// 	}
			// } else {
			// 	sideMenu.current.classList.toggle("hidden");
			// 	sideMenu.current.classList.toggle("block");
			// }
			sideMenu.current.classList.toggle("hidden");
			sideMenu.current.classList.toggle("block");
		}
	};

	return (
		<>
			<aside
				ref={sideMenu}
				className='fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-full border-r bg-black/50 xl:block xl:w-fit xl:bg-transparent'
				onClick={(e) => toggleSideMenu(e)}>
				<ScrollArea className='flex h-full w-64 flex-col items-start justify-start bg-background py-3 pl-3 pr-3 xl:w-72 xl:pr-5'>
					<MenuGroup>
						<MenuItem>
							<Link
								href={"/"}
								className='flex w-full flex-row space-x-4'>
								<House />
								<p>Home</p>
							</Link>
						</MenuItem>
						<MenuItem>
							<Link
								href={"/explore"}
								className='flex w-full flex-row space-x-4'>
								<Telescope />
								<p>Explore</p>
							</Link>
						</MenuItem>
						<MenuItem>
							<Link
								href={"/create"}
								className='flex w-full flex-row space-x-4'>
								<NotebookPen />
								<p>Write post</p>
							</Link>
						</MenuItem>
					</MenuGroup>
					<MenuSeperator />
					<MenuGroup>
						<MenuGroupHeader>You</MenuGroupHeader>
						<MenuItem>
							<Link
								href={"/me/profile"}
								className='flex w-full flex-row space-x-4'>
								<SquareUser />
								<p>Profile</p>
							</Link>
						</MenuItem>
						<MenuItem>
							<Link
								href={"/me/posts"}
								className='flex w-full flex-row space-x-4'>
								<NotebookText />
								<p>Your posts</p>
							</Link>
						</MenuItem>
						<MenuItem>
							<Link
								href={"/me/saved"}
								className='flex w-full flex-row space-x-4'>
								<Bookmark />
								<p>Saved</p>
							</Link>
						</MenuItem>
					</MenuGroup>
					<MenuSeperator />
					<MenuGroup>
						<MenuGroupHeader>Communities</MenuGroupHeader>
						<MenuItem>
							<div className='flex w-full flex-row space-x-4'>
								<HiOutlineUserGroup className='h-6 w-6' />
								<span>Group</span>
							</div>
						</MenuItem>
						<MenuItem>
							<a
								href='https://bigbruhh-messenger.vercel.app'
								target='_blank'
								className='flex w-full flex-row space-x-4'>
								<MessageCircleMore />
								<span>Messenger</span>
							</a>
						</MenuItem>
					</MenuGroup>
					<MenuSeperator />
					<MenuGroup>
						<CollapsibleMenu label='Games'>
							<CollapsibleContent>
								<MenuItem>
									<div className='flex w-full flex-row space-x-4'>
										<Grid3X3 />
										<p>Sudoku</p>
									</div>
								</MenuItem>
								<MenuItem>
									<div className='flex w-full flex-row space-x-4'>
										<GiTicTacToe className='h-6 w-6' />
										<p>Tic-Tac-Toe</p>
									</div>
								</MenuItem>
							</CollapsibleContent>
						</CollapsibleMenu>
					</MenuGroup>
					<MenuSeperator />
					<MenuGroup>
						<CollapsibleMenu label='Subscriptions'>
							<CollapsibleContent className='mt-1'>
								<div className='flex w-full flex-row items-center space-x-2 p-1'>
									<Avatar className='h-9 w-9'>
										<AvatarImage src='' />
										<AvatarFallback>
											<User className='h-full w-full cursor-pointer bg-accent p-2' />
										</AvatarFallback>
									</Avatar>
									<p>Writter</p>
								</div>
								<div className='flex w-full flex-row items-center space-x-2 p-1'>
									<Avatar className='h-9 w-9'>
										<AvatarImage src='' />
										<AvatarFallback>
											<User className='h-full w-full cursor-pointer bg-accent p-2' />
										</AvatarFallback>
									</Avatar>
									<p>Writter</p>
								</div>
								<div className='flex w-full flex-row items-center space-x-2 p-1'>
									<Avatar className='h-9 w-9'>
										<AvatarImage src='' />
										<AvatarFallback>
											<User className='h-full w-full cursor-pointer bg-accent p-2' />
										</AvatarFallback>
									</Avatar>
									<p>Writter</p>
								</div>
							</CollapsibleContent>
						</CollapsibleMenu>
					</MenuGroup>
					<MenuSeperator />
					<footer className='flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1 p-2 text-sm font-bold'>
						<a>About</a>
						<a>Copyright</a>
						<a>Contact</a>
						<a>Terms</a>
						<a>Privacy</a>
						<p className='text-center text-xs font-light'>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mauris purus,
							viverra et neque finibus, finibus tincidunt libero. Quisque ullamcorper dapibus ex
							sit amet aliquam.
						</p>
						<p className='mt-3 w-full text-center text-[0.625rem] font-light'>
							Enlighten @2024. All rights reserved.
						</p>
					</footer>
				</ScrollArea>
			</aside>
			<div className='flex flex-row items-center justify-start gap-1 pr-3'>
				<IconButton
					className='xl:hidden'
					onClick={() => toggleSideMenu()}>
					<Menu />
				</IconButton>
				<Link
					href={"/"}
					className='flex flex-shrink-0 flex-row items-center gap-2'>
					<Image
						src={"/icons/light.png"}
						alt='Enlighten'
						height={192}
						width={192}
						className='h-8 w-8 rounded-md dark:hidden'
					/>
					<Image
						src={"/icons/dark.png"}
						alt='Enlighten'
						height={192}
						width={192}
						className='hidden h-8 w-8 rounded-md dark:block'
					/>
					<h1 className='hidden text-2xl font-bold sm:inline-block'>Enlighten</h1>
				</Link>
			</div>
		</>
	);
};
