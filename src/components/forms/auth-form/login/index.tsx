"use client";

import { SignIn } from "@/actions/grpc/public";
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
import { SignInRequest } from "@/grpc/protobuf/public_service";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, {
		message: "Password must be 6 characters or longer",
	}),
});

function LoginForm() {
	const [isPending, setIsPending] = useState<boolean>(false);
	const [success, setSuccess] = useState<string>("");
	const [error, setError] = useState<string>("");
	const form = useForm<SignInRequest>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = async (req: SignInRequest) => {
		setIsPending(true);
		setError("");
		await SignIn(req)
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
			headerLabel='Sign In'
			showOAuth={true}
			footerLinkLabel="Don't have an account? Signup here!"
			footerLinkHref='/signup'>
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
										placeholder='Email'
										type='email'></Input>
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
										placeholder='Password'></PasswordInput>
								</FormControl>
								<FormMessage></FormMessage>
							</FormItem>
						)}></FormField>
					<FormSuccess message={success} />
					<FormError message={error} />
					<Button
						type='submit'
						disabled={isPending}>
						Login
					</Button>
				</form>
			</Form>
		</FormWrapper>
	);
}

export default LoginForm;
