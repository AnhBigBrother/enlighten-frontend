import { cn } from "@/lib/utils";
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
	title: string;
	content: string;
	clipped?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export const PostContent = ({ title, content, clipped = false, className }: Props) => {
	return (
		<article
			className={cn(
				"prose prose-sm prose-neutral dark:prose-invert prose-headings:my-0 prose-lead:my-0 prose-p:my-0 prose-a:my-0 prose-blockquote:my-0 prose-figure:my-0 prose-figcaption:my-0 prose-strong:my-0 prose-em:my-0 prose-kbd:my-0 prose-code:my-0 prose-pre:my-0 prose-ol:my-0 prose-ul:my-0 prose-li:my-0 prose-table:my-0 prose-thead:my-0 prose-tr:my-0 prose-td:my-0 prose-pre:rounded-md prose-pre:bg-secondary prose-img:my-1 prose-video:my-1 prose-a:text-blue-500 prose-a:no-underline prose-hr:my-0 prose-img:max-w-full prose-img:object-cover flex w-full max-w-none flex-col gap-5 p-1 py-6",
				className,
			)}>
			<h1>{title}</h1>
			<Markdown
				className={cn("whitespace-pre-line", clipped && "line-clamp-[8] overflow-y-clip")}
				remarkPlugins={[remarkGfm]}>
				{content}
			</Markdown>
		</article>
	);
};
