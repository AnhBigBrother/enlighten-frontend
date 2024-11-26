import Image from "next/image";
import Link from "next/link";
import React from "react";

function FormHeader({ label }: { label: string }) {
	return (
		<div className='flex flex-col items-center justify-center gap-2'>
			<Link
				href='/'
				className='flex items-center gap-2'>
				<Image
					className='hidden dark:block'
					src='/icons/dark.png'
					alt='messenger'
					width={36}
					height={36}></Image>
				<Image
					className='dark:hidden'
					src='/icons/light.png'
					alt='messenger'
					width={36}
					height={36}></Image>
				<h1 className='text-3xl font-semibold'>Enlighten</h1>
			</Link>
			<p className='text-center text-sm text-muted-foreground'>{label}</p>
		</div>
	);
}

export { FormHeader };
