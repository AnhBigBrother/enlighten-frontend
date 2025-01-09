"use client";

import { useEffect, useRef } from "react";

const useClickOutside = (callback: () => void) => {
	const ref = useRef<HTMLElement>(null);
	useEffect(() => {
		const handler = (e: any) => {
			if (!ref.current || ref.current.contains(e.target)) {
				return;
			}
			callback();
		};
		document.addEventListener("mousedown", handler);
		document.addEventListener("touchstart", handler);

		return () => {
			document.removeEventListener("mousedown", handler);
			document.removeEventListener("touchstart", handler);
		};
	}, [callback]);

	return ref;
};

export { useClickOutside };
