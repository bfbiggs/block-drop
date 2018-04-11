/**
 * Public API:
 *   - createGame1() creates a game
 * 
 * The game is a stateful object that processes a series of ticks (steps)
 * 
 * Core Responsibilities:
 * - Calculate the events of each turn of the game
 * - Keep Score
 * - Track Level
 */
import {
  addBlock,
  removeBlock,
  gravityDrop,
} from './board';
import {
  debugBlock,
  move,
} from './block';
import {
  Block,
  Board,
  Game,
  GameConfig,
} from '../interfaces';
import {
  copyBuffer,
} from '../util';
import { rotateLeft, rotateRight } from './block';

const CLEAR_OFFSET = 1;

export function clearCheck(
  buffer: Uint8Array,
  board: Board,
  detectAndClear: (markOffset?: number) => number,
  forceBufferCopy: boolean,
  offset = CLEAR_OFFSET,
) {
  const cleared = detectAndClear(offset);

  if (cleared || forceBufferCopy) { copyBuffer(board.desc, buffer); }

  return cleared;
}

export function updateBlock(
  board: Board,
  block: Block,
  buffer: Uint8Array,
  enableShadow: boolean,
  updateFn: () => any,
) {
  removeBlock(board, block, buffer, enableShadow);
  updateFn();
  addBlock(board, block, buffer, enableShadow);
}

function cartesianControl(
  game: Game, 
  axis: 'x' | 'y', 
  magnitude: number, 
  can: (board: Board, block: Block) => boolean,
) {
  if (can(game.board, game.state.activePiece)) {
    game.moveBlock(axis, magnitude);
    game.emit('redraw');
  }
}

export function createGame1(
  conf: GameConfig, 
  emit,
  buffer: Uint8Array,
  board: Board,
  detectAndClear,
  nextBlock,
  gameOver,
): Game {
  const game: Game = {
    state: {
      activePiece: nextBlock(), 
      buffer,
      cascadeCount: 1,
      conf,
      isEnded: false,
      isClearDelay: false,
      level: 1,
      levelPrev: 1,
      nextLevelThreshold: 45,
      rowsCleared: 0,
      rowsClearedPrev: 0,
      score: 0,
      tilesCleared: 0,
      tilesClearedPrev: 0,
    },
    controls: {
      endGame: () => {
        game.state.isEnded = true;
      },
      moveDown: () => cartesianControl(game, 'y', 1, conf.canMoveDown),
      moveLeft: () => cartesianControl(game, 'x', -1, conf.canMoveLeft),
      moveRight: () => cartesianControl(game, 'x', 1, conf.canMoveRight),
      moveUp: () => {
        while (conf.canMoveDown(board, game.state.activePiece)) {
          game.moveBlock('y', 1);
        }
        emit('redraw');
      },
      rotateLeft: () => {
        if (conf.canRotateLeft(board, game.state.activePiece)) {
          updateBlock(
            board, game.state.activePiece, buffer, conf.enableShadow,
            () => rotateLeft(game.state.activePiece)
          ),
          emit('redraw');
        }
      },
      rotateRight: () => {
        if (conf.canRotateRight(board, game.state.activePiece)) {
          updateBlock(
            board, game.state.activePiece, buffer, conf.enableShadow,
            () => rotateRight(game.state.activePiece)
          ),
          emit('redraw');
        }
      },
    },
    addBlock,
    board,
    clearCheck: (offset: number = 0) => clearCheck(
      buffer, board, game.detectAndClear, false, offset
    ),
    clearNonSolids: () => {
      let didClear = 0;
      for (let i = 0; i < buffer.length; i += 1) {
        if (board.desc[i] % 10 === 0) {
          continue;
        }
        board.desc[i] = 0;
        buffer[i] = 0;

        didClear += 1;
      }
      return didClear;
    },
    detectAndClear: (markOffset = 0) => detectAndClear(
      board, conf.connectedBlocks, markOffset 
    ),
    emit,
    gameOver,
    gravityDrop: () => {
      gravityDrop(board);
      copyBuffer(board.desc, buffer);
    },
    moveBlock: (axis: 'x' | 'y', quantity: number) => {
      updateBlock(
        board, 
        game.state.activePiece, 
        buffer, 
        conf.enableShadow, 
        () => {
        move(game.state.activePiece, axis, quantity);
      });
    },
    newBlock: () => {
      game.state.activePiece = game.nextBlock();
      if (conf.debug) {
        debugBlock('New Piece:', game.state.activePiece);
      }
      addBlock(board, game.state.activePiece, buffer, conf.enableShadow);
    },
    nextBlock,
    tick: (delta: number) => conf.tick(game, delta),
  }; 
  return game;
}