"use client";

import { Signup } from "@/actions/auth";
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
import { SignupDTO, SignupSchema } from "@/schemas/auth-schema";
import useUserStore from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function SignupForm() {
	const router = useRouter();
	const [isPending, setIsPending] = useState<boolean>(false);
	const [success, setSuccess] = useState<string>("");
	const [error, setError] = useState<string>("");
	const form = useForm<SignupDTO>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			email: "",
			name: "",
			password: "",
		},
	});
	const updateUser = useUserStore.use.update();
	const onSubmit = async (data: SignupDTO) => {
		setIsPending(true);
		setError("");
		const result = await Signup(data);
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
			headerLabel='Signup'
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
								<FormLabel>Email</FormLabel>
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
								<FormLabel>Name</FormLabel>
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
								<FormLabel>Password</FormLabel>
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
