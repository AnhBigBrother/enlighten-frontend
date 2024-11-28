import {
	COOKIE_AGE,
	FRONTEND_URL,
	GITHUB_REDIRECT_URI,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_GET_TOKEN_URL,
} from "@/constants";
import { _post } from "@/lib/fetch";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		/*<---get gihub's access_token--->*/
		const code = req.nextUrl.searchParams.get("code")!;
		const url = new URL(GITHUB_GET_TOKEN_URL);
		url.searchParams.set("code", code);
		url.searchParams.set("client_id", GITHUB_CLIENT_ID);
		url.searchParams.set("client_secret", GITHUB_CLIENT_SECRET);
		url.searchParams.set("redirect_uri", GITHUB_REDIRECT_URI);
		const token = await fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: url.searchParams.toString(),
		}).then((res) => res.json());

		/*<---login to backend via github access_token--->*/
		const { access_token, refresh_token } = await _post("oauth/github", {
			searchParams: { token_type: token.token_type, access_token: token.access_token },
		});

		/*<---set cookies and redirect--->*/
		const cookieStore = await cookies();
		cookieStore.set("access_token", access_token, { maxAge: COOKIE_AGE });
		cookieStore.set("refresh_token", refresh_token, { maxAge: COOKIE_AGE });
		return NextResponse.redirect(FRONTEND_URL);
	} catch (error) {
		console.error(error);
		return NextResponse.redirect(FRONTEND_URL);
	}
}
