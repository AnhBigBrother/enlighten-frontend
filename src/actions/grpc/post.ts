"use server";

import { ActionResponse, preventAccessTokenExpired, SortType } from "@/actions/grpc/_utils";
import { GrpcPostClient } from "@/actions/grpc/_utils";
import {
	AddPostCommentRequest,
	AddPostCommentResponse,
	CheckPostInteractedRequest,
	CheckPostInteractedResponse,
	CreatePostRequest,
	CreatePostResponse,
	DownVotePostRequest,
	DownVotePostResponse,
	GetAllSavedPostsRequest,
	GetAllSavedPostsResponse,
	GetFollowedPostsRequest,
	GetFollowedPostsResponse,
	SavePostRequest,
	SavePostResponse,
	UnSavePostRequest,
	UnSavePostResponse,
	UpVotePostRequest,
	UpVotePostResponse,
} from "@/grpc/protobuf/post_service";
import { Metadata, status } from "@grpc/grpc-js";
import { cookies } from "next/headers";

export async function GetFollowedPosts(sort: SortType, limit: number, offset: number) {
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
	const client = GrpcPostClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: GetFollowedPostsRequest = {
		access_token,
		sort,
		limit,
		offset,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<GetFollowedPostsResponse["posts"]>>((resolve) => {
			client.getFollowedPosts(req, metadata, (err, res) => {
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

export async function CreatePost(title: string, content: string) {
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
	const client = GrpcPostClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: CreatePostRequest = {
		access_token,
		title,
		content,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<CreatePostResponse>>((resolve) => {
			client.createPost(req, metadata, (err, res) => {
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

export async function UpVotePost(post_id: string) {
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
	const client = GrpcPostClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: UpVotePostRequest = {
		access_token,
		post_id,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<UpVotePostResponse>>((resolve) => {
			client.upVotePost(req, metadata, (err, res) => {
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

export async function DownVotePost(post_id: string) {
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
	const client = GrpcPostClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: DownVotePostRequest = {
		access_token,
		post_id,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<DownVotePostResponse>>((resolve) => {
			client.downVotePost(req, metadata, (err, res) => {
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

export async function SavePost(post_id: string) {
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
	const client = GrpcPostClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: SavePostRequest = {
		access_token,
		post_id,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<SavePostResponse>>((resolve) => {
			client.savePost(req, metadata, (err, res) => {
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

export async function UnSavePost(post_id: string) {
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
	const client = GrpcPostClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: UnSavePostRequest = {
		access_token,
		post_id,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<UnSavePostResponse>>((resolve) => {
			client.unSavePost(req, metadata, (err, res) => {
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

export async function GetAllSavedPosts(sort: SortType, limit: number, offset: number) {
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
	const client = GrpcPostClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: GetAllSavedPostsRequest = {
		access_token,
		sort,
		limit,
		offset,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<GetAllSavedPostsResponse["posts"]>>((resolve) => {
			client.getAllSavedPosts(req, metadata, (err, res) => {
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

export async function CheckPostInteracted(post_id: string) {
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
	const client = GrpcPostClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: CheckPostInteractedRequest = {
		access_token,
		post_id,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<CheckPostInteractedResponse>>((resolve) => {
			client.checkPostInteracted(req, metadata, (err, res) => {
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

export async function AddPostComment(post_id: string, comment: string) {
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
	const client = GrpcPostClient();
	const metadata = new Metadata();
	metadata.add("access_token", access_token);
	const req: AddPostCommentRequest = {
		access_token,
		post_id,
		comment,
	};
	return preventAccessTokenExpired(cookieStore, metadata, () => {
		return new Promise<ActionResponse<AddPostCommentResponse>>((resolve) => {
			client.addPostComment(req, metadata, (err, res) => {
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
