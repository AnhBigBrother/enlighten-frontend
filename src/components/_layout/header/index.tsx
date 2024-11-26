import { Logo } from "@/components/_layout/header/logo";
import { Search } from "@/components/_layout/header/search";
import { Setting } from "@/components/_layout/header/settings";
import React from "react";

const Heading = () => {
	return (
		<header className='sticky left-0 top-0 z-10 h-16 w-full border-b px-1 md:px-3 xl:px-5'>
			<nav className='relative flex h-full w-full flex-row items-center justify-between gap-3 md:gap-10'>
				<Logo />
				<Search />
				<Setting />
			</nav>
		</header>
	);
};

export default Heading;
