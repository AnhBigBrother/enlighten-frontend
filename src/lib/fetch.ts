import { BACKEND_DOMAIN } from "@/constants";

type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Options = {
	body?: any;
	authorization?: string;
	searchParams?: { [key: string]: string };
};

/*<---request configuration--->*/
const request = (path: string, method: Methods, options?: Options) => {
	const url = new URL(path, BACKEND_DOMAIN);
	if (options?.searchParams) {
		for (let key of Object.keys(options?.searchParams))
			url.searchParams.set(key, options?.searchParams[key]);
	}
	return fetch(url, {
		method,
		credentials: "include", // allows cross-origin requests to include cookies and authentication headers.
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			...(options?.authorization && { authorization: options.authorization }),
		},
		...(method !== "GET" &&
			method !== "DELETE" &&
			options?.body && { body: JSON.stringify(options.body) }),
	});
};

/*<---handle token rotation--->*/
const handleTokenRotation = async (path: string, method: Methods, options?: Options) => {
	const res1 = await request(path, method, options);
	const data1 = await res1.json();
	if (!res1.ok) {
		if (data1.error !== "unauthorized: access_token failed") throw data1;
		const res2 = await request("api/v1/user/me/access_token", "GET");
		const data2 = await res2.json();
		if (!res2.ok || !data2.access_token || !data2.refresh_token) throw data2;
		options = { ...options, authorization: `Bearer ${data2.access_token}` };
		const res3 = await request(path, method, options);
		const data3 = await res3.json();
		if (!res3.ok) throw data3;
		return data3;
	}
	return data1;
};

/*<---client fetch funcion--->*/
export const _get = async (path: string, options?: Options) =>
	handleTokenRotation(path, "GET", options);
export const _post = (path: string, options?: Options) =>
	handleTokenRotation(path, "POST", options);
export const _patch = (path: string, options?: Options) =>
	handleTokenRotation(path, "PATCH", options);
export const _put = (path: string, options?: Options) =>
	handleTokenRotation(path, "PUT", options);
export const _delete = (path: string, options?: Options) =>
	handleTokenRotation(path, "DELETE", options);
