"use client";

import useUserStore from "@/stores/user-store";
import { useLayoutEffect } from "react";
import { redirect } from "next/navigation";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = useUserStore.use.user();
	useLayoutEffect(() => {
		if (user) {
			redirect("/");
		}
	}, [user]);
	return (
		<div className='grid h-screen w-screen place-content-center bg-secondary'>{children}</div>
	);
}
