import {
	COOKIE_AGE,
	FRONTEND_URL,
	MICROSOFT_CLIENT_ID,
	MICROSOFT_CLIENT_SECRET,
	MICROSOFT_GET_TOKEN_URL,
	MICROSOFT_REDIRECT_URI,
} from "@/constants";
import { _post } from "@/lib/fetch";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		/*<---get microsoft's access_token--->*/
		const code = req.nextUrl.searchParams.get("code")!;
		const url = new URL(MICROSOFT_GET_TOKEN_URL);
		url.searchParams.set("grant_type", "authorization_code");
		url.searchParams.set("client_id", MICROSOFT_CLIENT_ID);
		url.searchParams.set("client_secret", MICROSOFT_CLIENT_SECRET);
		url.searchParams.set("redirect_uri", MICROSOFT_REDIRECT_URI);
		url.searchParams.set("code", code);
		const token = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: url.searchParams.toString(),
		}).then((res) => res.json());

		/*<---login to backend via microsoft access_token--->*/
		const { access_token, refresh_token } = await _post("auth/microsoft", {
			searchParams: { token_type: token.token_type, access_token: token.access_token },
		});

		/*<---set cookies and redirect--->*/
		const cookieStore = cookies();
		cookieStore.set("access_token", access_token, { maxAge: COOKIE_AGE });
		cookieStore.set("refresh_token", refresh_token, { maxAge: COOKIE_AGE });
		return NextResponse.redirect(FRONTEND_URL);
	} catch (error) {
		console.error(error);
		return NextResponse.redirect(FRONTEND_URL);
	}
}
