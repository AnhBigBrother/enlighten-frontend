"use client";

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
import { _post } from "@/lib/fetch";
import { LoginDTO, LoginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
	const [isPending, setIsPending] = useState<boolean>(false);
	const [success, setSuccess] = useState<string>("");
	const [error, setError] = useState<string>("");
	const form = useForm<LoginDTO>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = async (data: LoginDTO) => {
		setIsPending(true);
		setError("");
		const { access_token, refresh_token } = await _post("api/v1/auth/signin", {
			body: data,
		}).catch((err) => {
			setSuccess("");
			setError(err.error);
			setIsPending(false);
			return;
		});
		setError("");
		setSuccess("Success!");
		window.location.href = `/api/setCookies?access_token=${access_token}&refresh_token=${refresh_token}`;
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
