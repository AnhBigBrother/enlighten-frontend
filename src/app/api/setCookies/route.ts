import { COOKIE_AGE, FRONTEND_DOMAIN } from "@/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const redirect_to = searchParams.get("redirect_to");

	const cookieStore = await cookies();

	for (let pair of searchParams.entries()) {
		const [key, value] = pair;
		if (key === "redirect_to") {
			continue;
		}
		cookieStore.set(key, value, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: COOKIE_AGE,
		});
	}

	if (!redirect_to) {
		return NextResponse.redirect(FRONTEND_DOMAIN, 307);
	}

	try {
		const redirect_url = new URL(redirect_to);
		if (redirect_url.pathname === req.nextUrl.pathname) {
			return NextResponse.redirect(FRONTEND_DOMAIN, 307);
		}
		return NextResponse.redirect(redirect_url, 307);
	} catch (error) {
		return NextResponse.redirect(FRONTEND_DOMAIN, 307);
	}
}

export async function POST(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const cookieStore = await cookies();
	for (let pair of searchParams.entries()) {
		const [key, value] = pair;
		cookieStore.set(key, value, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: COOKIE_AGE,
		});
	}
	return NextResponse.json({ message: "All cookies have been set" });
}

export async function DELETE(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const cookieStore = await cookies();
	for (let pair of searchParams.entries()) {
		const [key, value] = pair;
		cookieStore.set(key, value, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: -1,
		});
	}
	return NextResponse.json({ message: "Cookies deleted" });
}
