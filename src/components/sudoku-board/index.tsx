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
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	LucideCircleHelp,
	Pause,
	Play,
} from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { secondToTimeString } from "@/lib/functions";
import { checkSolvable, getHint } from "@/lib/sudoku";

type Difficulty = {
	label: "Hard" | "Medium" | "Easy";
	value: number;
};

const Difficulties: Difficulty[] = [
	{
		label: "Easy",
		value: 20,
	},
	{
		label: "Medium",
		value: 40,
	},
	{
		label: "Hard",
		value: 60,
	},
];

type Key = {
	value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

const keys: Key[] = [
	{ value: 0 },
	{ value: 1 },
	{ value: 2 },
	{ value: 3 },
	{ value: 4 },
	{ value: 5 },
	{ value: 6 },
	{ value: 7 },
	{ value: 8 },
	{ value: 9 },
];

type SquarePosition = {
	x: number;
	y: number;
};

const SquareCell = ({
	position,
	focusingSquare,
	setFocusingSquare,
	board,
	initBoard,
	pressedKey,
	className,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
	position: SquarePosition;
	focusingSquare: SquarePosition;
	setFocusingSquare: React.Dispatch<React.SetStateAction<SquarePosition>>;
	board: number[][];
	pressedKey: Key;
	initBoard: number[][];
}) => {
	const [value, setValue] = useState<string>("");
	const [isValid, setIsValid] = useState<boolean>(true);
	const ref = useRef<HTMLInputElement>(null);
	useEffect(() => {
		setIsValid(true);
		setValue(board[position.x][position.y] !== 0 ? String(board[position.x][position.y]) : "");
	}, [board]);
	useEffect(() => {
		if (position.x === focusingSquare.x && position.y === focusingSquare.y) {
			ref.current?.focus();
		}
	}, [focusingSquare]);
	useEffect(() => {
		if (
			position.x === focusingSquare.x &&
			position.y === focusingSquare.y &&
			initBoard[position.x][position.y] === 0
		) {
			if (pressedKey.value === 0) {
				setValue("");
				setIsValid(true);
				board[position.x][position.y] = 0;
				return;
			}
			board[position.x][position.y] = pressedKey.value;
			const solvable = checkSolvable(board);
			setIsValid(solvable);
			setValue(String(pressedKey.value));
		}
	}, [pressedKey]);
	const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (initBoard[position.x][position.y] > 0) return;
		if (e.key === "Backspace" || e.key === "Delete") {
			setValue("");
			setIsValid(true);
			board[position.x][position.y] = 0;
			return;
		}
		if (e.key.search(/[1-9]/g) > -1) {
			board[position.x][position.y] = Number(e.key);
			const solvable = checkSolvable(board);
			setIsValid(solvable);
			setValue(e.key);
		}
	};
	return (
		<input
			ref={ref}
			readOnly
			className={cn(
				"h-full w-full rounded-lg border text-center text-lg outline-none",
				className,
				{
					"bg-secondary": initBoard[position.x][position.y] > 0,
					"text-blue-500": isValid && initBoard[position.x][position.y] === 0,
					"text-red-500": !isValid && initBoard[position.x][position.y] === 0,
					"border-primary": position.x === focusingSquare.x && position.y === focusingSquare.y,
				},
			)}
			onChange={() => {}}
			value={value}
			onKeyDown={handleOnKeyDown}
			onClick={() => setFocusingSquare({ x: position.x, y: position.y })}></input>
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
	const [pressedKey, setPressedKey] = useState<Key>({ value: 0 });
	const [mode, setMode] = useState<"play" | "create">("play");
	const [difficulty, setDifficulty] = useState<Difficulty>(Difficulties[1]);
	const [focusingSquare, setFocusingSquare] = useState<SquarePosition>({ x: 0, y: 0 });
	const matrix: any[][] = new Array(9).fill(new Array(9).fill(null));
	const [timer, isTicking, setIsTicking, clearTimer] = useTimer(1);
	useEffect(() => {
		clearTimer();
		_get("api/v1/games/sudoku", {
			searchParams: {
				hide: `${difficulty.value}`,
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
		_post("api/v1/games/sudoku", {
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
	const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowUp") {
			if (focusingSquare.x === 0) return;
			setFocusingSquare({ x: focusingSquare.x - 1, y: focusingSquare.y });
			return;
		}
		if (e.key === "ArrowDown") {
			if (focusingSquare.x === 8) return;
			setFocusingSquare({ x: focusingSquare.x + 1, y: focusingSquare.y });
			return;
		}
		if (e.key === "ArrowLeft") {
			if (focusingSquare.y === 0) return;
			setFocusingSquare({ x: focusingSquare.x, y: focusingSquare.y - 1 });
			return;
		}
		if (e.key === "ArrowRight") {
			if (focusingSquare.y === 8) return;
			setFocusingSquare({ x: focusingSquare.x, y: focusingSquare.y + 1 });
			return;
		}
	};
	return (
		<div
			className='my-5'
			onKeyDown={handleOnKeyDown}>
			<h1 className='w-full py-3 text-center text-2xl font-bold'>Sudoku</h1>
			<div className='flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:p-5 sm:pt-8'>
				<div className='flex flex-grow flex-col'>
					<div className='flex w-full flex-wrap justify-center gap-x-10 px-4 font-bold sm:justify-between'>
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
						{matrix.map((row, x) => (
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
										<SquareCell
											pressedKey={pressedKey}
											className='col-span-4 row-span-4'
											board={board}
											initBoard={initBoard}
											position={{ x, y }}
											focusingSquare={focusingSquare}
											setFocusingSquare={setFocusingSquare}
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
				<div className='flex w-full flex-shrink-0 flex-col items-start gap-5 px-3 sm:w-36 sm:justify-start sm:gap-12 sm:px-0'>
					<div className='flex w-full flex-row items-center justify-between gap-2 sm:flex-col'>
						<div className='flex w-full flex-col gap-2'>
							<Button
								className='h-10 w-full flex-shrink-0 sm:h-20 sm:w-36'
								variant='outline'
								onClick={() => setIsTicking((pre) => !pre)}>
								{isTicking ? <Pause /> : <Play />}
								<span>{secondToTimeString(timer)}</span>
							</Button>
							<Button onClick={() => handleNewGame()}>New game</Button>
						</div>
						<div className='flex w-full flex-col gap-2'>
							{mode === "play" ? (
								<>
									<Button onClick={() => handleSolve()}>Solve</Button>
									<Button
										className='h-fit whitespace-break-spaces'
										onClick={() => setMode("create")}>
										Create Sudoku
									</Button>
								</>
							) : (
								<Button onClick={() => setMode("play")}>Play</Button>
							)}
						</div>
					</div>
					<div className='flex w-full flex-row items-center justify-center gap-5 sm:flex-col'>
						<div className='grid h-24 flex-shrink-0 grid-cols-3 grid-rows-3 items-center gap-1'>
							<div></div>
							<Button
								onClick={() => {
									setFocusingSquare((pre) => {
										if (pre.x === 0) {
											return pre;
										}
										return { x: pre.x - 1, y: pre.y };
									});
								}}>
								<ChevronUp />
							</Button>
							<div></div>
							<Button
								onClick={() => {
									setFocusingSquare((pre) => {
										if (pre.y === 0) {
											return pre;
										}
										return { x: pre.x, y: pre.y - 1 };
									});
								}}>
								<ChevronLeft />
							</Button>
							<div></div>
							<Button
								onClick={() => {
									setFocusingSquare((pre) => {
										if (pre.y === 8) {
											return pre;
										}
										return { x: pre.x, y: pre.y + 1 };
									});
								}}>
								<ChevronRight />
							</Button>
							<div></div>
							<Button
								onClick={() => {
									setFocusingSquare((pre) => {
										if (pre.x === 8) {
											return pre;
										}
										return { x: pre.x + 1, y: pre.y };
									});
								}}>
								<ChevronDown />
							</Button>
							<div></div>
						</div>
						<div className='grid h-28 w-28 flex-shrink-0 grid-cols-3 grid-rows-3 items-center gap-1 sm:h-36 sm:w-36'>
							{new Array(9).fill(null).map((_, i) => (
								<Button
									key={`keyboard-${i + 1}`}
									className='h-full w-full'
									onClick={() => setPressedKey({ ...keys[i + 1] })}>
									{i + 1}
								</Button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
