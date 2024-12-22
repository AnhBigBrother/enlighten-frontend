"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { _get, _post } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import React, { useState, useRef, Fragment, useEffect } from "react";
import { FaEraser } from "react-icons/fa6";
import { LucideCircleHelp, Pause, Play } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { secondToTimeString } from "@/lib/functions";
import { checkSolvable, getHint } from "@/lib/sudoku";

type Difficulty = {
	label: string;
	value: string;
};

const Difficulties: Difficulty[] = [
	{
		label: "Easy",
		value: "20",
	},
	{
		label: "Medium",
		value: "40",
	},
	{
		label: "Hard",
		value: "60",
	},
];

export const SudokuCell = ({
	x,
	y,
	gridRef,
	board,
	initBoard,
	className,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	x: number;
	y: number;
	gridRef: React.MutableRefObject<HTMLInputElement | null>[][];
	board: number[][];
	initBoard: number[][];
}) => {
	const [value, setValue] = useState<string>("");
	const [isValid, setIsValid] = useState<boolean>(true);
	useEffect(() => {
		setIsValid(true);
		setValue(board[x][y] !== 0 ? String(board[x][y]) : "");
	}, [board]);
	const handlePressKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowUp") {
			if (x === 0) return;
			const downRef = gridRef[x - 1][y];
			downRef.current?.focus();
			return;
		}
		if (e.key === "ArrowDown") {
			if (x === 8) return;
			const downRef = gridRef[x + 1][y];
			downRef.current?.focus();
			return;
		}
		if (e.key === "ArrowLeft") {
			if (y === 0) return;
			const downRef = gridRef[x][y - 1];
			downRef.current?.focus();
			return;
		}
		if (e.key === "ArrowRight") {
			if (y === 8) return;
			const downRef = gridRef[x][y + 1];
			downRef.current?.focus();
			return;
		}
		if (initBoard[x][y] > 0) return;
		if (e.key === "Backspace" || e.key === "Delete") {
			setValue("");
			setIsValid(true);
			board[x][y] = 0;
			return;
		}
		if (e.key.search(/[1-9]/g) > -1) {
			board[x][y] = Number(e.key);
			const solvable = checkSolvable(board);
			setIsValid(solvable);
			setValue(e.key);
		}
	};
	return (
		<input
			ref={gridRef[x][y]}
			readOnly={initBoard[x][y] > 0}
			className={cn(
				"h-full w-full rounded-lg border text-center text-lg outline-none focus-within:border-primary",
				className,
				{
					"bg-secondary": initBoard[x][y] > 0,
					"text-blue-500": isValid && initBoard[x][y] === 0,
					"text-red-500": !isValid && initBoard[x][y] === 0,
				},
			)}
			onChange={() => {}}
			value={value}
			onKeyDown={handlePressKey}></input>
	);
};

export const SudokuBoard = () => {
	const { toast } = useToast();
	const [board, setBoard] = useState<number[][]>(
		new Array(9).fill(new Array(9).fill(0)).map((row) => [...row]),
	);
	const [initBoard, setInitBoard] = useState<number[][]>(
		new Array(9).fill(new Array(9).fill(0)).map((row) => [...row]),
	);
	const [mode, setMode] = useState<"play" | "create">("play");
	const [difficulty, setDifficulty] = useState<Difficulty>(Difficulties[1]);
	const gridRef: React.MutableRefObject<React.RefObject<HTMLInputElement>[][]> = useRef(
		new Array(9).fill(null).map(() => {
			const row = new Array(9).fill(null);
			return row.map(() => useRef<HTMLInputElement>(null));
		}),
	);
	const [timer, isTicking, setIsTicking, clearTimer] = useTimer(1);
	useEffect(() => {
		clearTimer();
		_get("api/v1/game/sudoku", {
			searchParams: {
				hide: difficulty.value,
			},
		})
			.then((data: { board: number[][] }) => {
				const newBoard = data.board.map((row) => [...row]);
				setBoard(newBoard);
				setInitBoard(data.board);
				setIsTicking(true);
			})
			.catch((err) => {
				toast({
					title: "Error",
					description: err.Error || "Cannot load board, try later.",
					variant: "destructive",
				});
				console.error(err);
			});
	}, [difficulty]);
	useEffect(() => {
		clearTimer();
		if (mode === "create") {
			setBoard(new Array(9).fill(new Array(9).fill(0)).map((row) => [...row]));
			setInitBoard(new Array(9).fill(new Array(9).fill(0)).map((row) => [...row]));
			return;
		}
		setInitBoard(board.map((row) => [...row]));
		setIsTicking(true);
	}, [mode]);
	const handleClear = () => {
		const newBoard = initBoard.map((row) => [...row]);
		setBoard(newBoard);
		clearTimer();
	};
	const handleNewGame = () => {
		setMode("play");
		clearTimer();
		setDifficulty((pre) => {
			return { ...pre };
		});
	};
	const handleSolve = () => {
		_post("api/v1/game/sudoku", {
			body: {
				board: board,
			},
		})
			.then(({ result }: { result: number[][] }) => {
				setBoard(result);
			})
			.catch((err) => {
				console.error(err);
				toast({
					title: "Error",
					description: err.Error || "Cannot solve, clear board and try again.",
					variant: "destructive",
				});
			})
			.finally(() => setIsTicking(false));
	};
	const handleHint = () => {
		const hintBoard = getHint(board);
		setBoard(hintBoard);
	};
	return (
		<div className='my-10 flex flex-col rounded-xl border p-3 sm:flex-row sm:p-5'>
			<div className='flex flex-grow flex-col'>
				<div className='mt-2 flex w-full flex-wrap justify-center gap-x-10 px-4 font-bold sm:justify-between'>
					{mode === "play" ? (
						<>
							<div className='flex flex-row items-center justify-start'>
								<DropdownMenu>
									<DropdownMenuTrigger className='mr-2 outline-none hover:underline'>
										Difficulty:
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										{Difficulties.map((d) => (
											<DropdownMenuItem
												key={`difficulty-${d.label}`}
												onClick={() => setDifficulty(d)}>
												{d.label}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
								<h3
									className={cn({
										"text-green-500": difficulty.label === "Easy",
										"text-amber-500": difficulty.label === "Medium",
										"text-red-500": difficulty.label === "Hard",
									})}>
									{difficulty.label}
								</h3>
							</div>
							<div className='flex w-fit flex-shrink-0 flex-row items-center gap-3 text-sm'>
								<button
									className='flex items-end border-none px-0 outline-none hover:text-blue-500 hover:underline'
									onClick={() => handleClear()}>
									<FaEraser className='mr-1 h-5 w-5' />
									<span>Clear</span>
								</button>
								<button
									className='flex items-end border-none px-0 outline-none hover:text-blue-500 hover:underline'
									onClick={() => handleHint()}>
									<LucideCircleHelp className='mr-1 h-5 w-5' />
									<span>Hint</span>
								</button>
							</div>
						</>
					) : (
						<p># Create your Sudoku by filling the board below.</p>
					)}
				</div>
				<div className='grid aspect-square flex-grow grid-cols-40 grid-rows-40 gap-[0.12rem] sm:gap-[0.2rem]'>
					{gridRef.current.map((row, x) => (
						<Fragment key={`row-${x}`}>
							{x % 3 === 0 &&
								new Array(40).fill(null).map((_, i) => (
									<div
										key={`gap-x-${x / 3}-${i}`}
										className='col-span-1 row-span-1'></div>
								))}
							{row.map((_, y) => (
								<Fragment key={`cell-${x}${y}`}>
									{y % 3 === 0 && (
										<div
											key={`gap-y-${y / 3}-${y}`}
											className='col-span-1 row-span-4'></div>
									)}
									<SudokuCell
										className='col-span-4 row-span-4'
										gridRef={gridRef.current}
										board={board}
										initBoard={initBoard}
										x={x}
										y={y}
									/>
									{y === 8 && (
										<div
											key={`gap-y-4-${y}`}
											className='col-span-1 row-span-4'></div>
									)}
								</Fragment>
							))}
							{x === 8 &&
								new Array(40).fill(null).map((_, i) => (
									<div
										key={`gap-x-3-${i}`}
										className='col-span-1 row-span-1'></div>
								))}
						</Fragment>
					))}
				</div>
			</div>
			<div className='flex w-full flex-shrink-0 flex-col justify-center gap-3 px-3 sm:mt-3 sm:w-36 sm:justify-start sm:px-1'>
				<div className='flex flex-row justify-center gap-x-5 gap-y-3 sm:flex-col'>
					<div className='flex items-center justify-center gap-1 px-3'>
						<button
							className='rounded-full'
							onClick={() => setIsTicking((pre) => !pre)}>
							{isTicking ? <Pause className='p-1' /> : <Play className='p-1' />}
						</button>
						<span>{secondToTimeString(timer)}</span>
					</div>
					<Button onClick={() => handleNewGame()}>New game</Button>
				</div>
				<div className='flex w-full flex-row justify-center gap-3 sm:flex-col'>
					{mode === "play" ? (
						<>
							<Button onClick={() => handleSolve()}>Solve</Button>
							<Button
								className='h-fit whitespace-break-spaces'
								onClick={() => setMode("create")}>
								Create your own Sudoku
							</Button>
						</>
					) : (
						<Button onClick={() => setMode("play")}>Play</Button>
					)}
				</div>
			</div>
		</div>
	);
};
