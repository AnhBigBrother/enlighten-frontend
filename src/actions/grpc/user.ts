"use server";

import { ActionResponse, preventAccessTokenExpired, SortType } from "@/actions/grpc/_utils";
import { GrpcUserClient } from "@/grpc/grpc-clients";
import {
	CheckUserFollowedRequest,
	CheckUserFollowedResponse,
	FollowUserRequest,
	FollowUserResponse,
	GetFollowedUsersRequest,
	GetFollowedUsersResponse,
	GetMeRequest,
	GetMeResponse,
	GetMyOverviewRequest,
	GetMyOverviewResponse,
	GetMyPostRequest,
	GetMyPostResponse,
	GetSessionRequest,
	GetSessionResponse,
	SignOutRequest,
	SignOutResponse,
	UnFollowUserRequest,
	UnFollowUserResponse,
	UpdateMeRequest,
	UpdateMeResponse,
} from "@/grpc/protobuf/user_service";
import { Metadata, status } from "@grpc/grpc-js";
import { cookies } from "next/headers";

export async function SignOut(): Promise<ActionResponse<SignOutResponse>> {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value || "";
	const refresh_token = cookieStore.get("refresh_token")?.value || "";
	const client = GrpcUserClient();
	const req: SignOutRequest = {
		refresh_token: refresh_token,
	};
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	metadata.add("refresh_token", refresh_token);
	cookieStore.set("access_token", "", {
		sameSite: "strict",
		maxAge: -1,
	});
	cookieStore.set("refresh_token", "", {
		sameSite: "strict",
		maxAge: -1,
	});
	return new Promise((resolve) => {
		client.signOut(req, metadata, (err, res) => {
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
}

export async function GetMe() {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcUserClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: GetMeRequest = {
		access_token,
	};

	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<GetMeResponse>>((resolve) => {
			client.getMe(req, metadata, (err, res) => {
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
	});
}

export async function UpdateMe(req: UpdateMeRequest) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcUserClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);

	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<UpdateMeResponse>>((resolve) => {
			client.updateMe(req, metadata, (err, res) => {
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
	});
}

export async function GetSession() {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcUserClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: GetSessionRequest = {
		access_token,
	};

	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<GetSessionResponse>>((resolve) => {
			client.getSession(req, metadata, (err, res) => {
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
	});
}

export async function GetMyOverview() {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcUserClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: GetMyOverviewRequest = {
		access_token,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<GetMyOverviewResponse>>((resolve) => {
			client.getMyOverview(req, metadata, (err, res) => {
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
	});
}

export async function GetMyPost(sort: SortType, limit: number, offset: number) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcUserClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: GetMyPostRequest = {
		access_token,
		sort,
		limit,
		offset,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<GetMyPostResponse["posts"]>>((resolve) => {
			client.getMyPost(req, metadata, (err, res) => {
				if (err !== null) {
					return resolve({
						error: {
							code: err.code,
							details: err.details,
						},
					});
				}
				return resolve({ data: res.posts });
			});
		});
	});
}

export async function FollowUser(user_id: string) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcUserClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: FollowUserRequest = {
		access_token,
		user_id,
	};

	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<FollowUserResponse>>((resolve) => {
			client.followUser(req, metadata, (err, res) => {
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
	});
}

export async function UnFollowUser(user_id: string) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcUserClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: UnFollowUserRequest = {
		access_token,
		user_id,
	};

	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<UnFollowUserResponse>>((resolve) => {
			client.unFollowUser(req, metadata, (err, res) => {
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
	});
}

export async function CheckUserFollowed(user_id: string) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcUserClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: CheckUserFollowedRequest = {
		access_token,
		user_id,
	};

	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<CheckUserFollowedResponse>>((resolve) => {
			client.checkUserFollowed(req, metadata, (err, res) => {
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
	});
}

export async function GetFollowedUsers(limit: number, offset: number) {
	const cookieStore = await cookies();
	const access_token = cookieStore.get("access_token")?.value;
	if (!access_token) {
		return {
			error: {
				code: status.UNAUTHENTICATED,
				details: "access_token failed",
			},
		};
	}
	const client = GrpcUserClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: GetFollowedUsersRequest = {
		access_token,
		limit,
		offset,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<GetFollowedUsersResponse["followed"]>>((resolve) => {
			client.getFollowedUsers(req, metadata, (err, res) => {
				if (err !== null) {
					return resolve({
						error: {
							code: err.code,
							details: err.details,
						},
					});
				}
				return resolve({ data: res.followed });
			});
		});
	});
}
