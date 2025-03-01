"use client";

import { GetSession } from "@/actions/grpc/user";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import useProgressStore from "@/stores/progress-store";
import useUserStore from "@/stores/user-store";
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
		GetSession()
			.then((res) => {
				if (res.error || !res.data) {
					throw new Error("Session not found.");
				}
				updateUser(res.data);
				toast({
					title: "Welcome!",
					description: `You are loged in as ${res.data.name}`,
				});
			})
			.catch((err) => {
				resetUser();
			});
	}, []);

	return (
		<Progress
			className='fixed left-0 top-0 z-50 h-1 w-full rounded-none bg-transparent'
			value={progressValue}
		/>
	);
};
