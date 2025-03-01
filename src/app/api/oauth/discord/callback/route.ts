import { OauthDiscord } from "@/actions/grpc/oauth";
import {
	COOKIE_AGE,
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_GET_TOKEN_URL,
	DISCORD_REDIRECT_URI,
	FRONTEND_URL,
} from "@/constants";
import { cookies } from "next/headers";
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

		const token: { token_type: string; access_token: string } = await fetch(url, {
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: url.searchParams.toString(),
		}).then((res) => res.json());

		// call backend service to sign in and get access_token & refresh_token
		const res = await OauthDiscord(token.access_token, token.token_type);

		if (res.error || !res.data) {
			throw res.error;
		}

		if (res.data.access_token === "" && res.data.refresh_token === "") {
			return NextResponse.redirect(
				`${FRONTEND_URL}/signup?email=${res.data.user?.email}&name=${res.data.user?.name}&image=${res.data.user?.image}`,
			);
		}

		const cookieStore = await cookies();
		cookieStore.set("access_token", res.data.access_token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: COOKIE_AGE,
		});
		cookieStore.set("refresh_token", res.data.refresh_token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: COOKIE_AGE,
		});
		return NextResponse.redirect(FRONTEND_URL);
	} catch (error) {
		console.error(error);
		return NextResponse.redirect(FRONTEND_URL);
	}
}
