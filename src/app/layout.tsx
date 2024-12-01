import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { FirstLoad } from "@/components/_layout/first-load";
import PageHeader from "@/components/_layout/header";
import { Button } from "@/components/ui/button";
import { MenuList } from "@/components/ui/menu";
import { Suspense } from "react";

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
								<main className='flex-grow'>{children}</main>
								<aside className='sticky top-16 hidden h-[calc(100vh-4rem)] w-80 flex-shrink-0 overflow-auto py-5 lg:block'>
									<MenuList className='rounded-xl bg-secondary p-3 text-sm'>
										<div className='flex w-full items-center justify-between'>
											<h3 className='px-2 font-bold'>RECENTS</h3>
											<Button
												variant='link'
												className='text-blue-500'>
												Clear
											</Button>
										</div>
									</MenuList>
								</aside>
							</div>
						</div>
					</div>
					<Suspense fallback={<div>Loading...</div>}>{auth} </Suspense>
				</ThemeProvider>
			</body>
		</html>
	);
}
