import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { FirstLoad } from "@/components/_shared/first-load";
import PageHeader from "@/components/header";

import { Suspense } from "react";
import { Recents } from "@/components/_shared/recents";
import { Spinner } from "@/components/_shared/spinner";

const merriweather = localFont({
	src: "./merriweather.ttf",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Enlighten",
	description: "It is not the answer that enlightens, but the question.",
	icons: {
		icon: [
			{
				media: "(prefers-color-scheme: light)",
				url: "/icons/light.png",
				href: "/icons/light.png",
			},
			{
				media: "(prefers-color-scheme: dark)",
				url: "/icons/dark.png",
				href: "/icons/dark.png",
			},
		],
	},
};

export default function RootLayout({
	children,
	auth,
}: Readonly<{
	children: React.ReactNode;
	auth: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={merriweather.className}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange>
					<FirstLoad />
					<Toaster />
					<PageHeader />
					<div className='min-h-[calc(100vh-4rem)] xl:px-5'>
						<div className='flex w-full flex-col items-center justify-start xl:pl-72'>
							<div className='relative flex w-full max-w-[72rem] flex-row justify-start space-x-4 px-2'>
								<main className='min-w-0 flex-grow'>{children}</main>
								<Recents />
							</div>
						</div>
					</div>
					<Suspense
						fallback={
							<div className='fixed left-0 top-0 grid place-content-center'>
								<Spinner />
							</div>
						}>
						{auth}
					</Suspense>
				</ThemeProvider>
			</body>
		</html>
	);
}
