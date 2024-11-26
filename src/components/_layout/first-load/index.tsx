"use client";

import { useToast } from "@/hooks/use-toast";
import { _get } from "@/lib/fetch";
import useUserStore from "@/stores/user-store";
import { useEffect } from "react";

export const FirstLoad = () => {
	const updateUser = useUserStore.use.update();
	const resetUser = useUserStore.use.reset();
	const { toast } = useToast();
	useEffect(() => {
		const access_token = localStorage.getItem("access_token");
		_get("user/session", { authorization: access_token || "" })
			.then((session) => {
				const user = session.user;
				delete user.typ;
				updateUser(user);
				toast({
					title: "Welcome!",
					description: `You are loged in as ${user.name}`,
				});
			})
			.catch((err) => {
				resetUser();
				console.error(err);
			});
	}, []);

	return null;
};
