import {
	BACKEND_DOMAIN,
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_GET_TOKEN_URL,
	DISCORD_REDIRECT_URI,
	FRONTEND_DOMAIN,
} from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		/*<---get discord's access_token--->*/
		const code = req.nextUrl.searchParams.get("code")!;
		const url = new URL(DISCORD_GET_TOKEN_URL);
		url.searchParams.set("code", code);
		url.searchParams.set("client_id", DISCORD_CLIENT_ID);
		url.searchParams.set("client_secret", DISCORD_CLIENT_SECRET);
		url.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI);
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
			`${BACKEND_DOMAIN}/api/v1/auth/discord?token_type=${token.token_type}&access_token=${token.access_token}&redirect_to=${FRONTEND_DOMAIN}/api/setCookies`,
		);
	} catch (error) {
		console.error(error);
		return NextResponse.redirect(FRONTEND_DOMAIN);
	}
}
