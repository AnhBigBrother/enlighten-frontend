import { GOOGLE_REDIRECT_URI, GOOGLE_CLIENT_ID, GOOGLE_GET_CONSENT_URL } from "@/constants";
import { createRandomString } from "@/lib/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = new URL(GOOGLE_GET_CONSENT_URL);
	url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
	url.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("scope", "https://www.googleapis.com/auth/userinfo.profile email");
	url.searchParams.set("state", createRandomString(12));
	return NextResponse.json({ url: url.toString() });
}
