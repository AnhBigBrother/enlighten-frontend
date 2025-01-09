"use client";

import { RefObject, useEffect, useRef, useState } from "react";

const useOnScrollIn = (): [RefObject<any>, boolean] => {
	const [hasIntersected, setHasIntersected] = useState<boolean>(false);
	const observingComponentRef = useRef<any>(null);
	useEffect(() => {
		if (observingComponentRef.current) {
			const observer = new IntersectionObserver((entries) => {
				setHasIntersected(entries[0].isIntersecting);
			});
			observer.observe(observingComponentRef.current);
		}
	}, []);
	return [observingComponentRef, hasIntersected];
};

export { useOnScrollIn };
