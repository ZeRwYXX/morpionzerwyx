"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const localize_1 = __importDefault(require("../../config/localize"));
const AI_1 = __importDefault(require("../../tictactoe/AI"));
class GameBoardBuilder {
    constructor() {
        this.title = '';
        this.board = '';
        this.state = '';
    }
    withTitle(player1, player2) {
        this.title =
            localize_1.default.__('game.title', {
                player1: util_1.formatDiscordName(player1.displayName),
                player2: util_1.formatDiscordName(player2.displayName)
            }) + '\n\n';
        return this;
    }
    withBoard(boardSize, board) {
        this.board = '';
        for (let i = 0; i < boardSize * boardSize; i++) {
            this.board += GameBoardBuilder.PLAYER_EMOJIS[board[i]] + ' ';
            if ((i + 1) % boardSize === 0) {
                this.board += '\n';
            }
        }
        return this;
    }
    withEntityPlaying(entity) {
        if (entity instanceof AI_1.default) {
            this.state = localize_1.default.__('game.waiting-ai');
        }
        else if (!entity) {
            this.state = localize_1.default.__('game.load');
        }
        else {
            this.state = localize_1.default.__('game.action', { player: entity.toString() });
        }
        return this;
    }
    withEndingMessage(winner) {
        if (winner) {
            this.state = localize_1.default.__('game.win', { player: winner.toString() });
        }
        else {
            this.state = localize_1.default.__('game.end');
        }
        return this;
    }
    toString() {
        const state = this.state && this.board ? '\n' + this.state : this.state;
        return this.title + this.board + state;
    }
}
exports.default = GameBoardBuilder;
GameBoardBuilder.MOVE_REACTIONS = ['↖️', '⬆️', '↗️', '⬅️', '⏺️', '➡️', '↙️', '⬇️', '↘️'];
GameBoardBuilder.PLAYER_EMOJIS = ['⬜', '❌', '⭕️'];
