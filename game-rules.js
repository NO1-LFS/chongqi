"use strict";

const BOARD_SIZE = 4;

function createInitialState() {
    const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    for (let x = 0; x < BOARD_SIZE; x += 1) {
        board[x][0] = 1;
        board[x][BOARD_SIZE - 1] = 2;
    }
    return { board, currentTurn: 1, gameOver: false, winner: null };
}

function isInsideBoard(x, y) {
    return Number.isInteger(x) && Number.isInteger(y) &&
        x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function countPieces(board, player) {
    return board.reduce(
        (total, column) => total + column.filter(cell => cell === player).length,
        0
    );
}

function removeDefeatedPieces(state, movedX, movedY) {
    const player = state.currentTurn;
    const opponent = 3 - player;
    const defeated = new Set();
    const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];

    for (const { dx, dy } of directions) {
        const friendX = movedX + dx;
        const friendY = movedY + dy;
        if (!isInsideBoard(friendX, friendY) || state.board[friendX][friendY] !== player) {
            continue;
        }

        const candidates = [
            {
                x: movedX - dx,
                y: movedY - dy,
                beyondX: movedX - 2 * dx,
                beyondY: movedY - 2 * dy
            },
            {
                x: movedX + 2 * dx,
                y: movedY + 2 * dy,
                beyondX: movedX + 3 * dx,
                beyondY: movedY + 3 * dy
            }
        ];

        for (const candidate of candidates) {
            if (!isInsideBoard(candidate.x, candidate.y) ||
                state.board[candidate.x][candidate.y] !== opponent) {
                continue;
            }

            const isTwoAgainstTwo =
                isInsideBoard(candidate.beyondX, candidate.beyondY) &&
                state.board[candidate.beyondX][candidate.beyondY] === opponent;

            if (!isTwoAgainstTwo) {
                defeated.add(`${candidate.x},${candidate.y}`);
            }
        }
    }

    for (const coordinate of defeated) {
        const [x, y] = coordinate.split(",").map(Number);
        state.board[x][y] = 0;
    }
}

function applyMove(state, player, move) {
    if (state.gameOver) return { ok: false, error: "本局已经结束" };
    if (player !== state.currentTurn) return { ok: false, error: "还没有轮到你" };

    const { from, to } = move || {};
    if (!from || !to || !isInsideBoard(from.x, from.y) || !isInsideBoard(to.x, to.y)) {
        return { ok: false, error: "落点不在棋盘内" };
    }
    if (state.board[from.x][from.y] !== player) {
        return { ok: false, error: "只能移动自己的棋子" };
    }
    if (state.board[to.x][to.y] !== 0) {
        return { ok: false, error: "目标位置已有棋子" };
    }

    const distance = Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
    if (distance !== 1) {
        return { ok: false, error: "每次只能上下左右移动一格" };
    }

    state.board[from.x][from.y] = 0;
    state.board[to.x][to.y] = player;
    removeDefeatedPieces(state, to.x, to.y);

    const opponent = 3 - player;
    if (countPieces(state.board, opponent) === 0) {
        state.gameOver = true;
        state.winner = player;
    } else {
        state.currentTurn = opponent;
    }

    return { ok: true };
}

module.exports = {
    applyMove,
    countPieces,
    createInitialState,
    isInsideBoard
};
