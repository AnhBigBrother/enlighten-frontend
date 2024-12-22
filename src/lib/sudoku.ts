const checkSolvable = (board: number[][]): boolean => {
	const cloneBoard: number[][] = board.map((row) => [...row]);
	const row = new Array(10).fill(new Array(10).fill(false)).map((row) => [...row]),
		col = new Array(10).fill(new Array(10).fill(false)).map((row) => [...row]),
		box = new Array(10).fill(new Array(10).fill(false)).map((row) => [...row]);
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
			if (cloneBoard[i][j] !== 0) {
				if (row[i][cloneBoard[i][j]] || col[j][cloneBoard[i][j]] || box[b][cloneBoard[i][j]])
					return false;
				row[i][cloneBoard[i][j]] = true;
				col[j][cloneBoard[i][j]] = true;
				box[b][cloneBoard[i][j]] = true;
			}
		}
	}
	let flag = false;
	const backtrack = (idx: number) => {
		if (idx > 80 || flag) {
			flag = true;
			return;
		}
		let i = Math.floor(idx / 9),
			j = idx % 9,
			b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
		if (cloneBoard[i][j] === 0) {
			for (let x = 1; x <= 9; x++) {
				if (!row[i][x] && !col[j][x] && !box[b][x]) {
					cloneBoard[i][j] = x;
					row[i][x] = true;
					col[j][x] = true;
					box[b][x] = true;
					backtrack(idx + 1);
					if (flag) return;
					cloneBoard[i][j] = 0;
					row[i][x] = false;
					col[j][x] = false;
					box[b][x] = false;
				}
			}
		} else {
			backtrack(idx + 1);
		}
	};
	backtrack(0);
	return flag;
};

const getHint = (board: number[][]): number[][] => {
	const cloneBoard: number[][] = board.map((row) => [...row]);
	const row = new Array(10).fill(new Array(10).fill(false)).map((row) => [...row]),
		col = new Array(10).fill(new Array(10).fill(false)).map((row) => [...row]),
		box = new Array(10).fill(new Array(10).fill(false)).map((row) => [...row]);
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
			if (cloneBoard[i][j] !== 0) {
				if (row[i][cloneBoard[i][j]] || col[j][cloneBoard[i][j]] || box[b][cloneBoard[i][j]])
					return cloneBoard;
				row[i][cloneBoard[i][j]] = true;
				col[j][cloneBoard[i][j]] = true;
				box[b][cloneBoard[i][j]] = true;
			}
		}
	}
	let flag = false;
	const backtrack = (idx: number) => {
		if (idx > 80 || flag) {
			flag = true;
			return;
		}
		let i = Math.floor(idx / 9),
			j = idx % 9,
			b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
		if (cloneBoard[i][j] === 0) {
			for (let x = 1; x <= 9; x++) {
				if (!row[i][x] && !col[j][x] && !box[b][x]) {
					cloneBoard[i][j] = x;
					row[i][x] = true;
					col[j][x] = true;
					box[b][x] = true;
					backtrack(idx + 1);
					if (flag) return;
					cloneBoard[i][j] = 0;
					row[i][x] = false;
					col[j][x] = false;
					box[b][x] = false;
				}
			}
		} else {
			backtrack(idx + 1);
		}
	};
	backtrack(0);
	if (!flag) {
		return board;
	}
	let wasHinted = false;
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (board[i][j] === 0) {
				if (!wasHinted) {
					wasHinted = true;
					continue;
				}
				cloneBoard[i][j] = 0;
			}
		}
	}
	return cloneBoard;
};

export { checkSolvable, getHint };
