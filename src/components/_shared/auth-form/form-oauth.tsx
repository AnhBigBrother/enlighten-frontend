"use client";

import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { CgMicrosoft } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function FormOAuth() {
	const { toast } = useToast();
	const handleSignInGoogle = async () => {
		try {
			const { url } = await fetch("/api/oauth/google").then((res) => res.json());
			window.location.href = url;
		} catch (error) {
			toast({
				title: "Failed to login",
				description: "Something went wrong, try later!",
				variant: "destructive",
			});
			console.error(error);
		}
	};
	const handleSignInGithub = async () => {
		try {
			const { url } = await fetch("/api/oauth/github").then((res) => res.json());
			window.location.href = url;
		} catch (error) {
			toast({
				title: "Failed to login",
				description: "Something went wrong, try later!",
				variant: "destructive",
			});
			console.error(error);
		}
	};
	const handleSignInMicrosoft = async () => {
		try {
			const { url } = await fetch("/api/oauth/microsoft").then((res) => res.json());
			window.location.href = url;
		} catch (error) {
			toast({
				title: "Failed to login",
				description: "Something went wrong, try later!",
				variant: "destructive",
			});
			console.error(error);
		}
	};
	const handleSignInDiscord = async () => {
		try {
			const { url } = await fetch("/api/oauth/discord").then((res) => res.json());
			window.location.href = url;
		} catch (error) {
			toast({
				title: "Failed to login",
				description: "Something went wrong, try later!",
				variant: "destructive",
			});
			console.error(error);
		}
	};

	return (
		<div className='flex w-full flex-col items-center justify-center gap-2'>
			<div className='flex w-full items-center justify-between px-1 text-gray-300'>
				<span className='w-auto flex-grow rounded-full border-t border-muted-foreground'></span>
				<span className='px-2 text-muted-foreground'>or</span>
				<span className='w-auto flex-grow rounded-full border-t border-muted-foreground'></span>
			</div>
			<Button
				onClick={handleSignInGoogle}
				size={"lg"}
				className='w-full'
				variant={"outline"}>
				<div className='flex h-full w-full items-center justify-center gap-3'>
					<FcGoogle className='h-5 w-5' />
					<span>Continue With Google</span>
				</div>
			</Button>
			<Button
				onClick={handleSignInMicrosoft}
				size={"lg"}
				className='w-full'
				variant={"outline"}>
				<div className='flex h-full w-full items-center justify-center gap-3'>
					<CgMicrosoft className='h-5 w-5' />
					<span>Continue With Microsoft</span>
				</div>
			</Button>
			<Button
				onClick={handleSignInGithub}
				size={"lg"}
				className='w-full'
				variant={"outline"}>
				<div className='flex h-full w-full items-center justify-center gap-3'>
					<FaGithub className='h-5 w-5' />
					<span>Continue With GitHub</span>
				</div>
			</Button>
			<Button
				onClick={handleSignInDiscord}
				size={"lg"}
				className='w-full'
				variant={"outline"}>
				<div className='flex h-full w-full items-center justify-center gap-3'>
					<FaDiscord className='h-5 w-5 text-[#5865F2]' />
					<span>Continue With Discord</span>
				</div>
			</Button>
		</div>
	);
}
