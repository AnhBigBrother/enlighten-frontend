import { RefObject, useEffect, useRef, useState } from "react";

const useOnScrollIn = (): [RefObject<any>, boolean] => {
	const [hasIntersected, setHasIntersected] = useState<boolean>(false);
	const lastComponentRef = useRef<any>(null);
	useEffect(() => {
		if (lastComponentRef.current) {
			const observer = new IntersectionObserver((entries) => {
				setHasIntersected(entries[0].isIntersecting);
			});
			observer.observe(lastComponentRef.current);
		}
	}, []);
	return [lastComponentRef, hasIntersected];
};

export { useOnScrollIn };
