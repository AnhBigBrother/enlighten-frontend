"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export const useTimer = (duration: number, startTime?: number, stopTime?: number) => {
	const [time, setTime] = useState<number>(startTime || 0);
	const [isTicking, setIsTicking] = useState<boolean>(false);
	const interval = useRef<NodeJS.Timeout>(undefined);

	stopTime &&
		useEffect(() => {
			if (time === stopTime) {
				setIsTicking(false);
			}
		}, [time]);
	useEffect(() => {
		if (isTicking) {
			interval.current = setInterval(() => setTime((pre) => pre + duration), duration * 1000);
		} else {
			clearInterval(interval.current);
		}
	}, [isTicking]);

	const clear = () => {
		setIsTicking(false);
		setTime(startTime || 0);
	};
	const ret: [number, boolean, Dispatch<SetStateAction<boolean>>, () => void] = [
		time,
		isTicking,
		setIsTicking,
		clear,
	];
	return ret;
};
