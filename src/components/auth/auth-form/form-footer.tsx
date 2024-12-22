import { ProgressLink } from "@/components/_shared/progress-link";
import { Button } from "@/components/ui/button";
import React from "react";

const FormFooter = ({ href, label }: { href: string; label: string }) => {
	return (
		<Button
			variant={"link"}
			className='w-full font-normal'
			size={"sm"}
			asChild>
			<ProgressLink href={href}>{label}</ProgressLink>
		</Button>
	);
};

export { FormFooter };
