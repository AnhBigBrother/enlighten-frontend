"use client";

import { Login } from "@/actions/auth";
import { FormError, FormSuccess } from "@/components/_shared/auth-form/form-notification";
import { FormWrapper } from "@/components/_shared/auth-form/form-wrapper";
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
import { _get } from "@/lib/fetch";
import { LoginDTO, LoginSchema } from "@/schemas/auth-schema";
import useUserStore from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
	const router = useRouter();
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
	const updateUser = useUserStore.use.update();
	const onSubmit = async (data: LoginDTO) => {
		setIsPending(true);
		setError("");
		const result = await Login(data);
		if (result.error) {
			setSuccess("");
			setError(result.message);
			setIsPending(false);
			return;
		}
		const access_token = result.access_token;
		localStorage.setItem("access_token", access_token);
		setError("");
		setSuccess("Success!");
		_get("user/session", { authorization: access_token || "" })
			.then((session) => {
				const user = session.user;
				delete user.typ;
				updateUser(user);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				router.push("/");
				setIsPending(false);
			});
	};

	return (
		<FormWrapper
			headerLabel='Login'
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
								<FormLabel>Email</FormLabel>
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
								<FormLabel>Password</FormLabel>
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
