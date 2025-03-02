"use server";

import { ActionResponse } from "@/actions/grpc/_utils";
import { GrpcGameClient } from "@/grpc/grpc-clients";
import {
	CheckSudokuSolvableRequest,
	CheckSudokuSolvableResponse,
	GenerateSudokuRequest,
	SolveSudokuRequest,
} from "@/grpc/protobuf/game_service";

export async function GenerateSudoku(
	req: GenerateSudokuRequest,
): Promise<ActionResponse<number[][]>> {
	const client = GrpcGameClient();
	return new Promise((resolve) => {
		client.generateSudoku(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			const board = [];
			board.push(
				res.line1,
				res.line2,
				res.line3,
				res.line4,
				res.line5,
				res.line6,
				res.line7,
				res.line8,
				res.line9,
			);
			return resolve({ data: board });
		});
	});
}

export async function SolveSudoku(board: number[][]): Promise<ActionResponse<number[][]>> {
	const req: SolveSudokuRequest = {
		line1: board[0],
		line2: board[1],
		line3: board[2],
		line4: board[3],
		line5: board[4],
		line6: board[5],
		line7: board[6],
		line8: board[7],
		line9: board[8],
	};
	const client = GrpcGameClient();
	return new Promise((resolve) => {
		client.solveSudoku(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			const board = [];
			board.push(
				res.line1,
				res.line2,
				res.line3,
				res.line4,
				res.line5,
				res.line6,
				res.line7,
				res.line8,
				res.line9,
			);
			return resolve({ data: board });
		});
	});
}

export async function CheckSudokuSolvable(
	board: number[][],
): Promise<ActionResponse<CheckSudokuSolvableResponse>> {
	const req: CheckSudokuSolvableRequest = {
		line1: board[0],
		line2: board[1],
		line3: board[2],
		line4: board[3],
		line5: board[4],
		line6: board[5],
		line7: board[6],
		line8: board[7],
		line9: board[8],
	};
	const client = GrpcGameClient();
	return new Promise((resolve) => {
		client.checkSudokuSolvable(req, (err, res) => {
			if (err !== null) {
				return resolve({
					error: {
						code: err.code,
						details: err.details,
					},
				});
			}
			return resolve({ data: res });
		});
	});
}
