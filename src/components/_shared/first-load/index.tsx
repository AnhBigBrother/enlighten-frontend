"use client";

import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { _get } from "@/lib/fetch";
import useProgressStore from "@/stores/progress-store";
import useUserStore, { TUser } from "@/stores/user-store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const FirstLoad = () => {
	const progressValue = useProgressStore.use.progress();
	const updateProgress = useProgressStore.use.update();
	const resetProgress = useProgressStore.use.reset();
	const updateUser = useUserStore.use.update();
	const resetUser = useUserStore.use.reset();
	const { toast } = useToast();
	const pathName = usePathname();

	useEffect(() => {
		updateProgress(66);
		setTimeout(() => updateProgress(100), 300);
		setTimeout(() => resetProgress(), 500);
	}, [pathName]);

	useEffect(() => {
		_get("api/v1/user/me/session")
			.then((userSession: TUser) => {
				if (!userSession) {
					throw new Error("Session not found.");
				}
				updateUser(userSession);
				toast({
					title: "Welcome!",
					description: `You are loged in as ${userSession.name}`,
				});
			})
			.catch((err) => {
				resetUser();
				toast({
					title: "Error!",
					description: err.error || "Something went wrong, try latter",
					variant: "destructive",
				});
				console.error(err);
			});
	}, []);

	return (
		<Progress
			className='fixed left-0 top-0 z-50 h-1 w-full rounded-none bg-transparent'
			value={progressValue}
		/>
	);
};
