import {
	BACKEND_DOMAIN,
	FRONTEND_DOMAIN,
	MICROSOFT_CLIENT_ID,
	MICROSOFT_CLIENT_SECRET,
	MICROSOFT_GET_TOKEN_URL,
	MICROSOFT_REDIRECT_URI,
} from "@/constants";
import { _post } from "@/lib/fetch";
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

		return NextResponse.redirect(
			`${BACKEND_DOMAIN}/api/v1/oauth/microsoft?token_type=${token.token_type}&access_token=${token.access_token}&redirect_to=${FRONTEND_DOMAIN}/api/setCookies`,
		);
	} catch (error) {
		console.error(error);
		return NextResponse.redirect(FRONTEND_DOMAIN);
	}
}
