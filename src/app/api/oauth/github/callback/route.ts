import {
	FRONTEND_DOMAIN,
	GITHUB_REDIRECT_URI,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GITHUB_GET_TOKEN_URL,
	BACKEND_DOMAIN,
} from "@/constants";
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

		return NextResponse.redirect(
			`${BACKEND_DOMAIN}/api/v1/oauth/github?token_type=${token.token_type}&access_token=${token.access_token}&redirect_to=${FRONTEND_DOMAIN}/api/setCookies`,
		);
	} catch (error) {
		console.error(error);
		return NextResponse.redirect(FRONTEND_DOMAIN);
	}
}
