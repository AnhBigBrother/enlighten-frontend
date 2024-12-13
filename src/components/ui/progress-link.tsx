"use client";

import useProgressStore from "@/stores/progress-store";
import Link from "next/link";
import React from "react";

export const ProgressLink = React.forwardRef(
	(
		{ href, onClick, ...attributes }: React.HTMLProps<HTMLAnchorElement>,
		ref: React.LegacyRef<HTMLAnchorElement>,
	) => {
		const updateProgress = useProgressStore.use.update();
		const handleClickLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			updateProgress(33);
			if (onClick) {
				onClick(e);
			}
		};

		return (
			<Link
				href={href!}
				ref={ref}
				onClick={(e) => handleClickLink(e)}
				{...attributes}
			/>
		);
	},
);
