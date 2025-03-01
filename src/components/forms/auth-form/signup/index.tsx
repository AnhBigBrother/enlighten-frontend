"use client";

import { SignUp } from "@/actions/grpc/public";
import { FormError, FormSuccess } from "@/components/forms/auth-form/form-notification";
import { FormWrapper } from "@/components/forms/auth-form/form-wrapper";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { FRONTEND_URL } from "@/constants";
import { SignUpRequest } from "@/grpc/protobuf/public_service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SignupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, {
		message: "Password must be 6 characters or longer",
	}),
	name: z
		.string()
		.min(3, {
			message: "Name must be 3 characters or longer",
		})
		.max(30, {
			message: "Name must be less than 30 characters",
		}),
	image: z.string().optional(),
});

function SignupForm() {
	const searchParams = useSearchParams();
	const [isPending, setIsPending] = useState<boolean>(false);
	const [success, setSuccess] = useState<string>("");
	const [error, setError] = useState<string>("");
	const form = useForm<SignUpRequest>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			email: searchParams.get("email") || "",
			name: searchParams.get("name") || "",
			password: "",
			image: searchParams.get("image") || "",
		},
	});
	const onSubmit = async (req: SignUpRequest) => {
		setIsPending(true);
		setError("");
		await SignUp(req)
			.then((res) => {
				if (res.error || !res.data) {
					throw res.error;
				}
				return res.data;
			})
			.then(() => {
				setError("");
				setSuccess("Success!");
			})
			.catch((err) => {
				setSuccess("");
				setError(err.error);
				setIsPending(false);
				return;
			})
			.finally(() => {
				window.location.href = FRONTEND_URL;
			});
	};

	return (
		<FormWrapper
			headerLabel='Sign Up'
			showOAuth={false}
			footerLinkLabel='Already have account? Login here!'
			footerLinkHref='/login'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col gap-5'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor='email'>Email</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Your email'
										type='email'></Input>
								</FormControl>
								<FormMessage></FormMessage>
							</FormItem>
						)}></FormField>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor='name'>Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder='Your name'
										type='text'></Input>
								</FormControl>
								<FormMessage></FormMessage>
							</FormItem>
						)}></FormField>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor='password'>Password</FormLabel>
								<FormControl>
									<PasswordInput
										{...field}
										placeholder='Your password'></PasswordInput>
								</FormControl>
								<FormMessage></FormMessage>
							</FormItem>
						)}></FormField>
					<FormSuccess message={success} />
					<FormError message={error} />
					<Button
						type='submit'
						disabled={isPending}>
						Signup
					</Button>
				</form>
			</Form>
		</FormWrapper>
	);
}

export default SignupForm;
