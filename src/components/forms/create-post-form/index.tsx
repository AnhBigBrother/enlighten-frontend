"use client";

import { CreatePost } from "@/actions/grpc/post";
import { PostContent } from "@/components/post/post-content";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ShowType = "preview" | "raw";

const CreatePostSchema = z.object({
	title: z
		.string()
		.min(1, {
			message: "Please fill out this field.",
		})
		.max(300, {
			message: "Title too long, please write less than 300 characters.",
		}),
	content: z.string().min(1, {
		message: "Please fill out this field.",
	}),
});

const CreatePostForm = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [showType, setShowType] = useState<ShowType>("raw");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const form = useForm<z.infer<typeof CreatePostSchema>>({
		resolver: zodResolver(CreatePostSchema),
		defaultValues: {
			title: "Your post's title",
			content:
				"Your post's content...\n[_*Markdown supported_](https://www.markdownguide.org/cheat-sheet/)\n\n![black puppy](https://picsum.photos/id/237/200/300 'black puppy')",
		},
	});

	const createPost = async (data: z.infer<typeof CreatePostSchema>) => {
		setIsLoading(true);
		await CreatePost(data.title, data.content)
			.then((res) => {
				if (res.error || !res.data) {
					throw res.error;
				}
				return res.data.created!;
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
				className='flex flex-col gap-5 sm:gap-7'>
				<div className='flex w-fit flex-row rounded-md border'>
					<Button
						type='button'
						variant={showType === "raw" ? "default" : "ghost"}
						onClick={() => setShowType("raw")}>
						Raw
					</Button>
					<Button
						type='button'
						variant={showType === "preview" ? "default" : "ghost"}
						onClick={() => setShowType("preview")}>
						Preview
					</Button>
				</div>

				{showType === "raw" ? (
					<div className='flex flex-col gap-3 sm:gap-5'>
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
					</div>
				) : (
					<PostContent
						title={form.getValues().title}
						content={form.getValues().content}
						className='rounded-lg border p-3 sm:p-5'
					/>
				)}

				<div className='flex w-full items-center justify-end gap-1'>
					<Button
						type='button'
						variant='secondary'
						disabled={isLoading}
						onClick={() => router.push("/")}>
						Cancel
					</Button>
					<Button
						type='submit'
						disabled={isLoading}>
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
};

export { CreatePostForm };
