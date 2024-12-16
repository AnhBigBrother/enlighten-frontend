import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();

	if (cookieStore.get("access_token")?.value) {
		redirect("/");
	}

	return (
		<div className='fixed left-0 top-0 z-50 grid h-screen w-screen place-content-center bg-black/20 backdrop-blur-sm'>
			{children}
		</div>
	);
}
