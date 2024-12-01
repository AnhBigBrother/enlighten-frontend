"use client";

import useUserStore from "@/stores/user-store";
import { useLayoutEffect } from "react";
import { redirect, useRouter } from "next/navigation";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = useUserStore.use.user();
	const router = useRouter();
	useLayoutEffect(() => {
		if (user) {
			redirect("/");
		}
	}, [user]);

	const handleClickOutside = (e: any) => {
		if (e.currentTarget != e.target) return;
		router.push("/");
	};

	return (
		<div
			className='fixed left-0 top-0 z-50 grid h-screen w-screen place-content-center bg-black/20 backdrop-blur-sm'
			onClick={(e) => handleClickOutside(e)}>
			{children}
		</div>
	);
}
