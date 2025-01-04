import { FormHeader } from "@/components/forms/auth-form/form-header";
import { FormOAuth } from "@/components/forms/auth-form/form-oauth";
import { FormFooter } from "@/components/forms/auth-form/form-footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import { X } from "lucide-react";
import Link from "next/link";

type FormWrapperProps = {
	children: React.ReactNode;
	headerLabel: string;
	footerLinkLabel: string;
	footerLinkHref: string;
	showOAuth?: boolean;
};

function FormWrapper({
	children,
	headerLabel,
	footerLinkLabel,
	footerLinkHref,
	showOAuth,
}: FormWrapperProps) {
	return (
		<Card className='relative w-fit shadow-lg sm:w-[23rem]'>
			<Link
				href={"/"}
				className='absolute right-4 top-4 h-6 w-6 cursor-pointer p-1'>
				<X className='h-full w-full' />
			</Link>
			<CardHeader>
				<FormHeader label={headerLabel}></FormHeader>
			</CardHeader>
			<CardContent> {children}</CardContent>
			{showOAuth && (
				<CardFooter>
					<FormOAuth />
				</CardFooter>
			)}
			<CardFooter>
				<FormFooter
					href={footerLinkHref}
					label={footerLinkLabel}></FormFooter>
			</CardFooter>
		</Card>
	);
}

export { FormWrapper };
