"use strict";

const crypto = require("crypto");
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { applyMove, createInitialState } = require("./game-rules");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const rooms = new Map();
const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

app.get("/", (_request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", (_request, response) => {
    response.json({ ok: true, rooms: rooms.size });
});

function createCode() {
    let code;
    do {
        code = Array.from({ length: 6 }, () =>
            ROOM_ALPHABET[crypto.randomInt(ROOM_ALPHABET.length)]
        ).join("");
    } while (rooms.has(code));
    return code;
}

function createToken() {
    return crypto.randomBytes(24).toString("hex");
}

function publicState(room) {
    return {
        roomId: room.id,
        board: room.state.board,
        currentTurn: room.state.currentTurn,
        gameOver: room.state.gameOver,
        winner: room.state.winner,
        connected: {
            black: Boolean(room.players[1].socketId),
            white: Boolean(room.players[2].socketId)
        },
        restartVotes: room.restartVotes.size
    };
}

function emitRoom(room) {
    io.to(room.id).emit("game-state", publicState(room));
}

function attachPlayer(socket, room, player) {
    const previousSocketId = room.players[player].socketId;
    if (previousSocketId && previousSocketId !== socket.id) {
        io.sockets.sockets.get(previousSocketId)?.disconnect(true);
    }
    room.players[player].socketId = socket.id;
    socket.data.roomId = room.id;
    socket.data.player = player;
    socket.join(room.id);
}

function findSession(roomId, token) {
    const room = rooms.get(roomId);
    if (!room) return null;
    for (const player of [1, 2]) {
        if (room.players[player].token === token) return { room, player };
    }
    return null;
}

io.on("connection", socket => {
    socket.on("create-room", (_payload, reply) => {
        if (socket.data.roomId) return reply({ ok: false, error: "你已经在房间中" });
        const id = createCode();
        const token = createToken();
        const room = {
            id,
            state: createInitialState(),
            players: {
                1: { token, socketId: null },
                2: { token: null, socketId: null }
            },
            restartVotes: new Set(),
            emptySince: null
        };
        rooms.set(id, room);
        attachPlayer(socket, room, 1);
        reply({ ok: true, roomId: id, player: 1, token });
        emitRoom(room);
    });

    socket.on("join-room", (payload, reply) => {
        if (socket.data.roomId) return reply({ ok: false, error: "你已经在房间中" });
        const roomId = String(payload?.roomId || "").trim().toUpperCase();
        const room = rooms.get(roomId);
        if (!room) return reply({ ok: false, error: "没有找到这个房间" });
        if (room.players[2].token) return reply({ ok: false, error: "房间已经满了" });

        const token = createToken();
        room.players[2].token = token;
        attachPlayer(socket, room, 2);
        reply({ ok: true, roomId, player: 2, token });
        emitRoom(room);
    });

    socket.on("resume-room", (payload, reply) => {
        const roomId = String(payload?.roomId || "").trim().toUpperCase();
        const session = findSession(roomId, payload?.token);
        if (!session) return reply({ ok: false, error: "对局已失效，请重新创建房间" });
        attachPlayer(socket, session.room, session.player);
        reply({ ok: true, roomId, player: session.player });
        emitRoom(session.room);
    });

    socket.on("make-move", (move, reply) => {
        const room = rooms.get(socket.data.roomId);
        if (!room) return reply?.({ ok: false, error: "你不在房间中" });
        if (!room.players[1].socketId || !room.players[2].socketId) {
            return reply?.({ ok: false, error: "请等待对手上线" });
        }

        const result = applyMove(room.state, socket.data.player, move);
        if (!result.ok) return reply?.(result);
        room.restartVotes.clear();
        reply?.({ ok: true });
        emitRoom(room);
    });

    socket.on("request-restart", (_payload, reply) => {
        const room = rooms.get(socket.data.roomId);
        if (!room) return reply?.({ ok: false, error: "你不在房间中" });
        room.restartVotes.add(socket.data.player);
        if (room.restartVotes.size === 2) {
            room.state = createInitialState();
            room.restartVotes.clear();
        }
        reply?.({ ok: true });
        emitRoom(room);
    });

    socket.on("disconnect", () => {
        const room = rooms.get(socket.data.roomId);
        if (!room) return;
        const player = socket.data.player;
        if (room.players[player]?.socketId === socket.id) {
            room.players[player].socketId = null;
        }
        if (!room.players[1].socketId && !room.players[2].socketId) {
            room.emptySince = Date.now();
        }
        emitRoom(room);
    });
});

setInterval(() => {
    const expiry = Date.now() - 30 * 60 * 1000;
    for (const [id, room] of rooms) {
        if (room.emptySince && room.emptySince < expiry) rooms.delete(id);
    }
}, 5 * 60 * 1000).unref();

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`冲棋服务已启动：http://localhost:${PORT}`);
});
