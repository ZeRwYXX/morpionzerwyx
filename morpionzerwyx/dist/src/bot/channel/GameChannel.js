"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameBoardMessage_1 = __importDefault(require("../gameboard/GameBoardMessage"));
const DuelRequestMessage_1 = __importDefault(require("../request/DuelRequestMessage"));
const localize_1 = __importDefault(require("../../config/localize"));
const AI_1 = __importDefault(require("../../tictactoe/AI"));
class GameChannel {
    constructor(bot, channel) {
        this.bot = bot;
        this._channel = channel;
        this.requests = [];
    }
    get channel() {
        return this._channel;
    }
    get gameRunning() {
        return this.gameBoard !== undefined;
    }
    sendDuelRequest(original, invited) {
        return __awaiter(this, void 0, void 0, function* () {
            const expireTime = this.bot.configuration.requestExpireTime;
            const message = new DuelRequestMessage_1.default(this, original, invited, expireTime);
            this.requests.push(message);
            yield message.send();
        });
    }
    closeDuelRequest(request, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield request.close(message);
            this.requests.splice(this.requests.indexOf(request), 1);
        });
    }
    endGame(winner) {
        var _a, _b;
        if (this.gameRunning) {
            if (winner) {
                this.bot.eventHandler.emitEvent('win', {
                    winner,
                    loser: (_a = this.gameBoard) === null || _a === void 0 ? void 0 : _a.entities.find(entity => entity !== winner)
                });
            }
            else {
                this.bot.eventHandler.emitEvent('tie', {
                    players: (_b = this.gameBoard) === null || _b === void 0 ? void 0 : _b.entities
                });
            }
            this.gameBoard = undefined;
        }
    }
    expireGame() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.gameRunning) {
                yield this.channel.send(localize_1.default.__('game.expire'));
                this.gameBoard = undefined;
            }
        });
    }
    createGame(member1, member2) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const request of this.requests) {
                yield request.close();
            }
            this.requests = [];
            if (!this.gameRunning) {
                this.gameBoard = new GameBoardMessage_1.default(this, member1, member2 !== null && member2 !== void 0 ? member2 : new AI_1.default(), this.bot.configuration);
                yield this.gameBoard.update();
                if (this.gameRunning) {
                    yield this.gameBoard.attemptNextTurn();
                }
            }
        });
    }
}
exports.default = GameChannel;
