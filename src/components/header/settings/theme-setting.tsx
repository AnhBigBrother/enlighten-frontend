"use client";

import React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useThemeContext } from "@/contexts/theme-color-provider";
import { Check } from "lucide-react";
import { ThemeColors } from "@/lib/theme-colors";

const availableThemeColors = [
	{ name: "Zinc", light: "bg-zinc-900", dark: "bg-zinc-700" },
	{ name: "Rose", light: "bg-rose-600", dark: "bg-rose-700" },
	{ name: "Blue", light: "bg-blue-600", dark: "bg-blue-600" },
	{ name: "Green", light: "bg-green-600", dark: "bg-green-600" },
	{ name: "Orange", light: "bg-orange-500", dark: "bg-orange-600" },
	{ name: "Yellow", light: "bg-yellow-500", dark: "bg-yellow-500" },
	{ name: "Violet", light: "bg-violet-500", dark: "bg-violet-600" },
];

export const ThemeSetting = () => {
	const { themeColor, setThemeColor } = useThemeContext();
	const { setTheme, theme } = useTheme();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className='flex w-full items-center justify-between px-2 py-[0.375rem] text-sm hover:bg-accent'>
					<h2>Theme</h2>
					<div className='ml-8 flex flex-row items-center gap-2 font-bold text-primary'>
						<div className='h-4 w-4 rounded-full bg-primary'></div>
						<span>{theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Auto"}</span>
					</div>
				</button>
			</DialogTrigger>
			<DialogContent className='max-w-max text-sm'>
				<DialogHeader>
					<DialogTitle>Theme setting</DialogTitle>
					<DialogDescription>
						Adjust how you&#39;d like Enlighten to appear on this browser.
					</DialogDescription>
				</DialogHeader>
				<div className='ml-2 flex flex-col gap-y-2'>
					<h2 className='font-semibold'>Primary color</h2>
					<div className='flex max-w-[32rem] flex-row flex-wrap items-center gap-4'>
						{availableThemeColors.map(({ name, light, dark }) => (
							<button
								className={cn(
									"item-center flex space-x-3 rounded-lg border px-3 py-[0.375rem]",
									themeColor === name && "border-2 border-primary",
								)}
								key={`${name}-theme`}
								onClick={() => setThemeColor(name as ThemeColors)}>
								<div className={cn("h-5 w-5 rounded-full", theme === "light" ? light : dark)}>
									{themeColor === name && <Check className='h-full w-full stroke-white' />}
								</div>
								<span className='text-sm'>{name}</span>
							</button>
						))}
					</div>
				</div>
				<div className='my-2 flex flex-col'>
					<h2 className='ml-2 font-semibold'>Darkmode</h2>
					<div className='flex flex-row items-center space-x-4'>
						<div
							onClick={() => setTheme("light")}
							className={cn("flex cursor-pointer flex-col space-y-2 rounded-md p-2", {
								"bg-accent": theme === "light",
							})}>
							<div className='flex items-center space-x-2'>
								<Checkbox
									id='light-mode'
									checked={theme === "light"}
								/>
								<label htmlFor='light-mode'>Light</label>
							</div>
							<Image
								src='/themes/light.svg'
								alt='Light mode'
								height={160}
								width={160}
								className='rounded-sm border border-muted-foreground'></Image>
						</div>
						<div
							onClick={() => setTheme("dark")}
							className={cn("flex cursor-pointer flex-col space-y-2 rounded-md p-2", {
								"bg-accent": theme === "dark",
							})}>
							<div className='flex items-center space-x-2'>
								<Checkbox
									id='dark-mode'
									checked={theme === "dark"}
								/>
								<label htmlFor='dark-mode'>Dark</label>
							</div>
							<Image
								src='/themes/dark.svg'
								alt='Dark mode'
								height={160}
								width={160}
								className='rounded-sm border border-muted-foreground'></Image>
						</div>
						<div
							onClick={() => setTheme("system")}
							className={cn("flex cursor-pointer flex-col space-y-2 rounded-md p-2", {
								"bg-accent": theme === "system",
							})}>
							<div className='flex items-center space-x-2'>
								<Checkbox
									id='system-mode'
									checked={theme === "system"}
								/>
								<label htmlFor='system-mode'>System</label>
							</div>
							<div className='relative h-fit w-fit flex-shrink-0 rounded-sm border border-muted-foreground'>
								<Image
									src='/themes/light.svg'
									alt='Light'
									height={160}
									width={160}
									className='rounded-l-sm rounded-r-lg'></Image>
								<Image
									src='/themes/dark.svg'
									alt='Dark'
									height={160}
									width={160}
									className='absolute right-0 top-0 h-full w-1/2 rounded-r-sm object-cover object-right'></Image>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button>Save change</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
