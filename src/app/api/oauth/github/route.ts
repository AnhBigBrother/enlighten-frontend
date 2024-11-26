import { GITHUB_REDIRECT_URI, GITHUB_CLIENT_ID, GITHUB_GET_CONSENT_URL } from "@/constants";
import { createRandomString } from "@/lib/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = new URL(GITHUB_GET_CONSENT_URL);
	url.searchParams.set("client_id", GITHUB_CLIENT_ID);
	url.searchParams.set("scope", "read:user user:email");
	url.searchParams.set("redirect_uri", GITHUB_REDIRECT_URI);
	url.searchParams.set("state", createRandomString(12));
	return NextResponse.json({ url: url.toString() });
}
