import React from "react";

type Props = {
	title: string;
	content: string;
};

export const PostContent = ({ title, content }: Props) => {
	return (
		<div className='flex flex-col gap-2 p-1 py-3 text-sm'>
			<h3 className='text-lg font-semibold'>{title}</h3>
			<p className='whitespace-pre-line'>{content}</p>
		</div>
	);
};
