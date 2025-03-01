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
				"prose-a:text-link prose prose-sm prose-neutral flex w-full max-w-none flex-col gap-5 p-1 py-6 dark:prose-invert prose-headings:my-0 prose-p:my-0 prose-a:my-0 prose-a:no-underline prose-blockquote:my-0 prose-figure:my-0 prose-figcaption:my-0 prose-strong:my-0 prose-em:my-0 prose-kbd:my-0 prose-code:my-0 prose-pre:my-0 prose-pre:rounded-md prose-pre:bg-secondary prose-pre:text-secondary-foreground prose-ol:my-0 prose-ul:my-0 prose-li:my-0 prose-table:my-0 prose-thead:my-0 prose-tr:my-0 prose-td:my-0 prose-img:my-1 prose-img:max-w-full prose-img:object-cover prose-video:my-1 prose-hr:my-0 prose-lead:my-0",
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
