import {
	MICROSOFT_CLIENT_ID,
	MICROSOFT_GET_CONSENT_URL,
	MICROSOFT_REDIRECT_URI,
} from "@/constants";
import { createRandomString } from "@/lib/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const url = new URL(MICROSOFT_GET_CONSENT_URL);
	url.searchParams.set("client_id", MICROSOFT_CLIENT_ID);
	url.searchParams.set("redirect_uri", MICROSOFT_REDIRECT_URI);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("response_mode", "query");
	url.searchParams.set("scope", "https://graph.microsoft.com/profile");
	url.searchParams.set("state", createRandomString(12));
	return NextResponse.json({ url: url.toString() });
}
