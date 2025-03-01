import { OauthMicrosoft } from "@/actions/grpc/oauth";
import {
	COOKIE_AGE,
	FRONTEND_URL,
	MICROSOFT_CLIENT_ID,
	MICROSOFT_CLIENT_SECRET,
	MICROSOFT_GET_TOKEN_URL,
	MICROSOFT_REDIRECT_URI,
} from "@/constants";
import { status } from "@grpc/grpc-js";
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

		const token: { token_type: string; access_token: string } = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: url.searchParams.toString(),
		}).then((res) => res.json());

		// call backend service to sign in and get access_token & refresh_token
		const res = await OauthMicrosoft(token.access_token, token.token_type);

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
