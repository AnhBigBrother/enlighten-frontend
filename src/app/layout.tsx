import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { FirstLoad } from "@/components/_layout/first-load";

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

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
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
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
