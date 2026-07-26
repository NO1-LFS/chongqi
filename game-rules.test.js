"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { applyMove, createInitialState } = require("./game-rules");

function emptyState(turn = 1) {
    const state = createInitialState();
    state.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    state.currentTurn = turn;
    return state;
}

test("移动形成二连会冲掉正对的单枚敌棋", () => {
    const state = emptyState();
    state.board[0][1] = 1;
    state.board[1][2] = 1;
    state.board[2][1] = 2;
    const result = applyMove(state, 1, { from: { x: 1, y: 2 }, to: { x: 1, y: 1 } });
    assert.equal(result.ok, true);
    assert.equal(state.board[2][1], 0);
});

test("主动冲到敌方二连前不会死亡", () => {
    const state = emptyState();
    state.board[0][1] = 1;
    state.board[2][1] = 2;
    state.board[3][1] = 2;
    const result = applyMove(state, 1, { from: { x: 0, y: 1 }, to: { x: 1, y: 1 } });
    assert.equal(result.ok, true);
    assert.equal(state.board[1][1], 1);
});

test("二对二时双方棋子都保留", () => {
    const state = emptyState();
    state.board[0][0] = 1;
    state.board[1][1] = 1;
    state.board[2][0] = 2;
    state.board[3][0] = 2;
    const result = applyMove(state, 1, { from: { x: 1, y: 1 }, to: { x: 1, y: 0 } });
    assert.equal(result.ok, true);
    assert.equal(state.board[2][0], 2);
    assert.equal(state.board[3][0], 2);
});

test("不能在对手回合移动", () => {
    const state = createInitialState();
    const result = applyMove(state, 2, { from: { x: 0, y: 3 }, to: { x: 0, y: 2 } });
    assert.equal(result.ok, false);
    assert.equal(result.error, "还没有轮到你");
});
