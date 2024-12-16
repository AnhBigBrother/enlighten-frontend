"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CollapsibleContent, CollapsibleMenu } from "@/components/ui/collapsible";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { _post } from "@/lib/fetch";
import { MyProfileDTO, MyProfileSchema } from "@/schemas/my-profile";
import { TUserInfo } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const MyProfile = ({ userData }: { userData: TUserInfo }) => {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, setIsPending] = useState<boolean>(false);
	const form = useForm<MyProfileDTO>({
		resolver: zodResolver(MyProfileSchema),
		defaultValues: {
			image: userData.image || "",
			name: userData.name,
			bio: userData.bio || "",
			newPassword: "",
			confirmPassword: "",
		},
	});
	const onSubmit = async (data: MyProfileDTO) => {
		setIsPending(true);
		_post("api/v1/user/me", {
			body: {
				name: data.name,
				image: data.image,
				password: data.newPassword,
				bio: data.bio,
			},
		})
			.then(() => {
				toast({
					title: "Success",
					description: "Your profile has been updated successfully.",
				});
				router.push("/");
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.error,
					variant: "destructive",
				});
			})
			.finally(() => setIsPending(false));
	};
	return (
		<div className='my-8 flex justify-center'>
			<Form {...form}>
				<form
					className='flex w-full max-w-[45rem] flex-col gap-6 rounded-xl border p-5 sm:p-10'
					onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name='image'
						render={({ field }) => (
							<div className='flex w-full items-center gap-6'>
								<FormItem className='w-full'>
									<FormLabel>Picture</FormLabel>
									<FormControl>
										<Input {...field}></Input>
									</FormControl>
									<FormMessage></FormMessage>
									<FormDescription>This is your public profile picture.</FormDescription>
								</FormItem>
								<Avatar className='h-20 w-20'>
									<AvatarImage src={field.value} />
									<AvatarFallback>
										<User className='h-full w-full bg-accent p-5' />
									</AvatarFallback>
								</Avatar>
							</div>
						)}></FormField>
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input
								value={userData.email}
								disabled></Input>
						</FormControl>
						<FormDescription>Your registed email.</FormDescription>
					</FormItem>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input {...field}></Input>
								</FormControl>
								<FormMessage></FormMessage>
								<FormDescription>Your public username.</FormDescription>
							</FormItem>
						)}></FormField>
					<FormField
						control={form.control}
						name='bio'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Bio</FormLabel>
								<FormControl>
									<Textarea {...field}></Textarea>
								</FormControl>
								<FormMessage></FormMessage>
								<FormDescription>Something about yourself.</FormDescription>
							</FormItem>
						)}></FormField>
					<CollapsibleMenu
						label={<h4 className='font-semibold'>Change password?</h4>}
						open={false}>
						<CollapsibleContent className='mt-4 flex flex-col gap-2'>
							<FormField
								control={form.control}
								name='newPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>New password</FormLabel>
										<FormControl>
											<PasswordInput {...field}></PasswordInput>
										</FormControl>
										<FormMessage></FormMessage>
									</FormItem>
								)}></FormField>
							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm new password</FormLabel>
										<FormControl>
											<PasswordInput {...field}></PasswordInput>
										</FormControl>
										<FormMessage></FormMessage>
									</FormItem>
								)}></FormField>
						</CollapsibleContent>
					</CollapsibleMenu>
					<div className='flex justify-end gap-3'>
						<Button
							type='button'
							variant='secondary'
							disabled={isPending}
							onClick={() => form.reset()}>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isPending}>
							Update
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default MyProfile;
