"use server";

import { COOKIE_AGE } from "@/constants";
import { GrpcPublicClient } from "@/grpc/clients";
import { GetAccessTokenRequest, GetAccessTokenResponse } from "@/grpc/protobuf/public_service";
import { Metadata, status } from "@grpc/grpc-js";
import { Status } from "@grpc/grpc-js/build/src/constants";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export type ActionResponse<T> = {
	data?: T;
	error?: {
		code: Status;
		details: string;
	};
};

export type SortType = "top" | "hot" | "new";

export const newAccessTokenCookie = async (
	cookieStore: ReadonlyRequestCookies,
): Promise<ActionResponse<GetAccessTokenResponse>> => {
	const refresh_token = cookieStore.get("refresh_token")?.value;
	if (!refresh_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "refresh_token failed",
			},
		};
	}
	const client = GrpcPublicClient();
	const req: GetAccessTokenRequest = {
		refresh_token: refresh_token,
	};
	const res = await new Promise<ActionResponse<GetAccessTokenResponse>>((resolve) => {
		client.getAccessToken(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res });
		});
	});
	if (res.error || !res.data) {
		cookieStore.set("access_token", "", {
			sameSite: "strict",
			maxAge: -1,
		});
		cookieStore.set("refresh_token", "", {
			sameSite: "strict",
			maxAge: -1,
		});
		return res;
	}
	cookieStore.set("access_token", res.data.access_token, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: COOKIE_AGE,
	});
	return res;
};

export const preventAccessTokenExpired = async <T>(
	cookieStore: ReadonlyRequestCookies,
	metadata: Metadata,
	caller: () => Promise<ActionResponse<T>>,
) => {
	const res = await caller();
	if (
		res.error &&
		res.error.code === status.UNAUTHENTICATED &&
		res.error.details === "access_token failed"
	) {
		const tokens = await newAccessTokenCookie(cookieStore);
		metadata.set("access_token", tokens.data?.access_token || "");
		const res2 = await caller();
		return res2;
	}
	return res;
};
