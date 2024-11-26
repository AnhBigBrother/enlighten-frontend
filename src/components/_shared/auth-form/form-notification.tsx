import { CircleCheck, TriangleAlert } from "lucide-react";

export const FormSuccess = ({ message }: { message: string }) => {
	if (!message) return null;
	return (
		<div className='flex items-center gap-x-2 rounded-md bg-green-500/20 p-3 text-green-500'>
			<CircleCheck className='h-5 w-5' />
			<p>{message}</p>
		</div>
	);
};

export function FormError({ message }: { message: string | undefined }) {
	if (!message) return null;
	return (
		<div className='flex items-center gap-x-2 rounded-md bg-red-500/20 p-3 text-red-500'>
			<TriangleAlert className='h-5 w-5' />
			<p>{message}</p>
		</div>
	);
}
