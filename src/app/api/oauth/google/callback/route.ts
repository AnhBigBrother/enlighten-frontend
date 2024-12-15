import {
	FRONTEND_DOMAIN,
	GOOGLE_REDIRECT_URI,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_GET_TOKEN_URL,
	BACKEND_DOMAIN,
} from "@/constants";
import { _post } from "@/lib/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		/*<---get google's access_token--->*/
		const code = req.nextUrl.searchParams.get("code")!;
		const url = new URL(GOOGLE_GET_TOKEN_URL);
		url.searchParams.set("code", code);
		url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
		url.searchParams.set("client_secret", GOOGLE_CLIENT_SECRET);
		url.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
		url.searchParams.set("grant_type", "authorization_code");

		const token = await fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: url.searchParams.toString(),
		}).then((res) => res.json());

		return NextResponse.redirect(
			`${BACKEND_DOMAIN}/api/v1/oauth/google?token_type=${token.token_type}&access_token=${token.access_token}&redirect_to=${FRONTEND_DOMAIN}/api/setCookies`,
		);
	} catch (error) {
		console.error(error);
		return NextResponse.redirect(FRONTEND_DOMAIN);
	}
}
