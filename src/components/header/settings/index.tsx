"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, User } from "lucide-react";
import useUserStore from "@/stores/user-store";
import { useToast } from "@/hooks/use-toast";
import { NotebookPen } from "lucide-react";
import React from "react";
import { IconButton } from "@/components/ui/icon-button";
import { ProgressLink } from "@/components/_shared/progress-link";
import { ThemeSetting } from "@/components/header/settings/theme-setting";
import { SignOut } from "@/actions/grpc/user";

export const Setting = () => {
	const user = useUserStore.use.user();
	const resetUser = useUserStore.use.reset();
	const { toast } = useToast();
	const handleLogout = () => {
		SignOut()
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res.data!;
			})
			.then((data) => {
				toast({
					title: data.message || "Loged out!",
					description: "You have been loged out",
				});
				fetch(`/api/setCookies?access_token=&refresh_token=`, {
					method: "DELETE",
				});
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.error || "Something went wrong, refresh page to continue.",
					variant: "destructive",
				});
			})
			.finally(() => {
				resetUser();
			});
	};
	return (
		<menu className='flex flex-row items-center space-x-1 md:space-x-3'>
			<div className='flex flex-row items-center'>
				<ProgressLink href={"/create"}>
					<IconButton>
						<NotebookPen />
						<p className='ml-2 hidden sm:inline-block'>Write</p>
					</IconButton>
				</ProgressLink>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<IconButton>
							<Bell />
						</IconButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Notifications</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem className='cursor-pointer'>Noti1</DropdownMenuItem>
							<DropdownMenuItem className='cursor-pointer'>Noti2</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className='cursor-pointer border'>
						<AvatarImage src={user?.image} />
						<AvatarFallback>
							<User className='h-full w-full bg-gradient-to-br from-secondary to-background p-2' />
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuGroup>
						{user ? (
							<DropdownMenuItem asChild>
								<ProgressLink
									href={"/me/profile"}
									className='flex h-full w-full cursor-pointer flex-col gap-3 py-2 hover:bg-secondary'>
									<div className='flex w-full items-center space-x-3'>
										<Avatar>
											<AvatarImage src={user?.image} />
											<AvatarFallback>
												<User className='h-full w-full rounded-full bg-gradient-to-br from-secondary to-background p-2' />
											</AvatarFallback>
										</Avatar>
										<span className='max-w-32 truncate'>{user?.name}</span>
									</div>
									<p className='max-w-48 truncate'>{user?.email}</p>
								</ProgressLink>
							</DropdownMenuItem>
						) : (
							<DropdownMenuLabel className='py-3 text-base'>Setting</DropdownMenuLabel>
						)}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<ThemeSetting />
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						{user ? (
							<DropdownMenuItem>
								<button
									className='h-full w-full text-start'
									onClick={() => handleLogout()}>
									Log out
								</button>
							</DropdownMenuItem>
						) : (
							<>
								<DropdownMenuItem asChild>
									<ProgressLink
										className='h-full w-full'
										href='/login'>
										Login
									</ProgressLink>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<ProgressLink
										className='h-full w-full'
										href='/signup'>
										Sign up
									</ProgressLink>
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</menu>
	);
};
