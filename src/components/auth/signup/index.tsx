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
import { SignupDTO, SignupSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

function SignupForm() {
	const searchParams = useSearchParams();
	const [isPending, setIsPending] = useState<boolean>(false);
	const [success, setSuccess] = useState<string>("");
	const [error, setError] = useState<string>("");
	const form = useForm<SignupDTO>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			email: searchParams.get("email") || "",
			name: searchParams.get("name") || "",
			password: "",
			image: searchParams.get("image") || "",
		},
	});
	const onSubmit = async (data: SignupDTO) => {
		setIsPending(true);
		setError("");
		const { access_token, refresh_token } = await await _post("api/v1/auth/signup", {
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
