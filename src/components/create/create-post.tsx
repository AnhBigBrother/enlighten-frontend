"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { _post } from "@/lib/fetch";
import { CreatePostDTO, CreatePostSchema } from "@/schemas/create-post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const CreatePost = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const form = useForm<CreatePostDTO>({
		resolver: zodResolver(CreatePostSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});

	const createPost = async (data: CreatePostDTO) => {
		const access_token = localStorage.getItem("access_token");
		setIsLoading(true);
		await _post("api/v1/post/create", {
			authorization: `Bearer ${access_token}`,
			body: data,
		})
			.then((post) => {
				toast({
					title: "Success",
					description: "Post has created successfully!",
				});
				router.push(`/post/${post.id}`);
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.error,
					variant: "destructive",
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(createPost)}
				className='flex flex-col gap-5'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<FormLabel
								htmlFor='title'
								className='font-bold'>
								Title
							</FormLabel>
							<FormControl>
								<Textarea
									className='h-16 rounded-lg bg-secondary'
									{...field}></Textarea>
							</FormControl>
							<FormMessage></FormMessage>
						</FormItem>
					)}></FormField>
				<FormField
					control={form.control}
					name='content'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<FormLabel
								htmlFor='content'
								className='font-bold'>
								Content
							</FormLabel>
							<FormControl>
								<Textarea
									className='h-64 rounded-lg bg-secondary'
									{...field}></Textarea>
							</FormControl>
							<FormMessage></FormMessage>
						</FormItem>
					)}></FormField>
				<div className='flex w-full items-center justify-end gap-3'>
					<Button
						type='button'
						variant='secondary'
						className='rounded-xl'
						disabled={isLoading}
						onClick={() => router.push("/")}>
						Cancel
					</Button>
					<Button
						type='submit'
						className='rounded-xl'
						disabled={isLoading}>
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default CreatePost;
