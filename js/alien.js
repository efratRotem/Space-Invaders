'use strict'

const ALIEN_SPEED = 500

var gIntervalAliens

// The following two variables represent the part of the matrix (some rows) 
// that we should shift (left, right, and bottom) // 
// We need to update those when: // 
// (1) shifting down and (2) last alien was cleared from row 

var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = ALIENS_ROW_COUNT - 1

var gIsAlienFreeze = true

var gCanShiftRight = true
var gCanShiftLeft = false
var gCanShiftDown = false

function createAliens(board) {
    for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            board[i][j] = { type: SKY, gameObject: ALIEN }
        }
    }
}

function handleAlienHit(pos) {

}

function shiftBoardRight(board, fromI, toI) {
    if (!gCanShiftRight) return

    var oldBoard = copyBoard(board)

    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // stop moving right - when an alien in the last board column
            if (board[i][board[0].length - 1].gameObject === ALIEN) {
                gCanShiftRight = false
                gCanShiftDown = true
                return
            }
            // cells in first column should be with gameObject = null
            board[i][j] = (j - 1 < 0) ? createCell() : oldBoard[i][j - 1]
        }
    }
    renderBoard(board)
}

function shiftBoardLeft(board, fromI, toI) {
    if (!gCanShiftLeft) return

    var oldBoard = copyBoard(board)

    for (var i = fromI; i <= toI; i++) {
        for (var j = board[0].length - 1; j >= 0; j--) {
            // // stop moving left - when an alien in the first board column
            if (board[i][0].gameObject === ALIEN) {
                gCanShiftLeft = false
                gCanShiftDown = true
                return
            }
            // cells in last column should be with gameObject = null
            board[i][j] = (j + 1 > board[0].length - 1) ? createCell() : oldBoard[i][j + 1]
        }
    }
    renderBoard(board)
}

function shiftBoardDown(board, fromI, toI) {
    if (!gCanShiftDown) return

    var oldBoard = copyBoard(board)

    for (var i = fromI; i < toI + 2; i++) {

        for (var j = 0; j < oldBoard[0].length; j++) {
            // if (board[i][j].gameObject === HERO) continue
            console.log('i,j:', i, j)
            board[i][j] = (i - 1 < 0) ? createCell() : oldBoard[i - 1][j]
        }

    }
    console.log('gAliensTopRowIdx:', gAliensTopRowIdx)
    console.log('gAliensBottomRowIdx:', gAliensBottomRowIdx)
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    console.log('gAliensTopRowIdx:', gAliensTopRowIdx)
    console.log('gAliensBottomRowIdx:', gAliensBottomRowIdx)
    renderBoard(board)

    gCanShiftDown = false
    if (!gCanShiftRight) gCanShiftLeft = true
    if (!gCanShiftLeft) gCanShiftRight = true
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time // 
// when the aliens are reaching the hero row - interval stops 
function moveAliens() {
    // if (gIsAlienFreeze) return
    setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    setInterval(shiftBoardLeft, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    setInterval(shiftBoardDown, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
}