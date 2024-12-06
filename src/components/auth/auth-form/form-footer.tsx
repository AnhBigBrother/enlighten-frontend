import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const FormFooter = ({ href, label }: { href: string; label: string }) => {
	return (
		<Button
			variant={"link"}
			className='w-full font-normal'
			size={"sm"}
			asChild>
			<Link href={href}>{label}</Link>
		</Button>
	);
};

export { FormFooter };
