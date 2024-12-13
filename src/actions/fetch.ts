"use server";

import { BACKEND_URL } from "@/constants";

type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Options = {
	body?: any;
	authorization?: string;
	searchParams?: { [key: string]: string };
};

/*<---server fetch data--->*/

export const Fetch = async (path: string, method: Methods, options?: Options) => {
	const url = new URL(path, BACKEND_URL);
	if (options?.searchParams) {
		for (let key of Object.keys(options?.searchParams))
			url.searchParams.set(key, options?.searchParams[key]);
	}
	return fetch(url, {
		method,
		credentials: "include",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			...(options?.authorization && { authorization: options.authorization }),
		},
		...(method !== "GET" &&
			method !== "DELETE" &&
			options?.body && { body: JSON.stringify(options.body) }),
	}).then((res) => res.json());
};
