import { COOKIE_AGE, FRONTEND_DOMAIN } from "@/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const redirect_to = searchParams.get("redirect_to");

	const cookieStore = await cookies();

	for (let pair of searchParams.entries()) {
		const [key, value] = pair;
		if (key === redirect_to) {
			continue;
		}
		cookieStore.set(key, value, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			domain: FRONTEND_DOMAIN,
			maxAge: COOKIE_AGE,
		});
	}

	if (!redirect_to) {
		return NextResponse.redirect(FRONTEND_DOMAIN);
	}

	try {
		const redirect_url = new URL(redirect_to);
		if (redirect_url.pathname === req.nextUrl.pathname) {
			return NextResponse.redirect(FRONTEND_DOMAIN);
		}
		return NextResponse.redirect(redirect_url);
	} catch (error) {
		return NextResponse.redirect(FRONTEND_DOMAIN);
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
			sameSite: "none",
			domain: FRONTEND_DOMAIN,
			maxAge: COOKIE_AGE,
		});
	}
	return NextResponse.json({ message: "All cookies have been set" });
}

export async function DELETE(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const redirect_to = searchParams.get("redirect_to");

	const cookieStore = await cookies();

	for (let pair of searchParams.entries()) {
		const [key, value] = pair;
		if (key === redirect_to) {
			continue;
		}
		cookieStore.set(key, value, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			domain: FRONTEND_DOMAIN,
			maxAge: -1,
		});
	}

	if (!redirect_to) {
		return NextResponse.json({ message: "Cookies deleted" });
	}

	try {
		const redirect_url = new URL(redirect_to);
		if (redirect_url.pathname === req.nextUrl.pathname) {
			return NextResponse.json({ message: "Cookies deleted" });
		}
		return NextResponse.redirect(redirect_url);
	} catch (error) {
		return NextResponse.json({ message: "Cookies deleted" });
	}
}
