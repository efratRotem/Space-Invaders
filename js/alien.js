'use strict'

const ALIEN_SPEED = 500

var gIntervalAliens
var gIntervalAliensRight
var gIntervalAliensLeft
var gIntervalAliensDown

// The following two variables represent the part of the matrix (some rows) 
// that we should shift (left, right, and bottom) // 
// We need to update those when: // 
// (1) shifting down and (2) last alien was cleared from row 

var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze = false

var gCanShiftRight = true
var gCanShiftLeft = false
var gCanShiftDown = false

function createAliens(board) {
    for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
        for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
            board[i][j] = { type: SKY, gameObject: ALIEN }
        }
    }
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = ALIENS_ROW_COUNT - 1
}

function handleAlienHit(pos) {
    if (gBoard[pos.i][pos.j].gameObject === ALIEN && gBoard[pos.i][pos.j].type === EARTH) alert('You Lost')

}

function shiftBoardRight(board, fromI = gAliensTopRowIdx, toI = gAliensBottomRowIdx) {
    if (!gCanShiftRight) return
    if (gCanShiftDown) return

    var oldBoard = copyBoard(board)

    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // stop moving right - when an alien in the last board column
            if (board[i][board[0].length - 1].gameObject === ALIEN) {
                gCanShiftRight = false
                gCanShiftDown = true
                gCanShiftLeft = true
                clearInterval(gIntervalAliensRight)
                return
            }
            // cells in first column should be with gameObject = null
            board[i][j] = (j - 1 < 0) ? createCell() : oldBoard[i][j - 1]
        }
    }
    renderBoard(board)
    // moveAliens()
}

function shiftBoardLeft(board, fromI = gAliensTopRowIdx, toI = gAliensBottomRowIdx) {
    if (!gCanShiftLeft) return
    if (gCanShiftDown) return
    var oldBoard = copyBoard(board)

    for (var i = fromI; i <= toI; i++) {
        for (var j = board[0].length - 1; j >= -1; j--) {

            board[i][j] = (j === board[0].length - 1) ? createCell() : oldBoard[i][j + 1]
            // // stop moving left - when an alien in the first board column
            var cell = board[i][0]
            if (cell.gameObject === ALIEN) {
                gCanShiftLeft = false
                gCanShiftRight = true
                gCanShiftDown = true
                clearInterval(gIntervalAliensLeft)
                return
            }
            // cells in last column should be with gameObject = null
        }
    }
    renderBoard(board)
    // moveAliens()
}

function shiftBoardDown(board, fromI, toI) {
    if (!gCanShiftDown) return

    var oldBoard = copyBoard(board)

    for (var i = fromI; i < toI + 2; i++) {

        for (var j = 0; j < oldBoard[0].length; j++) {
            // if (board[i][j].gameObject === HERO) continue
            board[i][j] = (i - 1 < 0) ? createCell() : oldBoard[i - 1][j]
        }
    }

    renderBoard(board)

    if (isLost()) gameOver(false)

    gCanShiftDown = false

    updateAlienRowIdx()
    clearInterval(gIntervalAliensDown)
    clearInterval(gIntervalAliensLeft)
    clearInterval(gIntervalAliensRight)
    moveAliens()
}

// runs the interval for moving aliens side to side and down
// it re-renders the board every time // 
// when the aliens are reaching the hero row - interval stops 
function moveAliens() {
    if (gIsAlienFreeze) return
    if (!gGame.isOn) return

    gIntervalAliensRight = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    gIntervalAliensDown = setInterval(shiftBoardDown, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    gIntervalAliensLeft = setInterval(shiftBoardLeft, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
}

function updateAlienRowIdx() {
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
}

function isLost() {

    for (var i = gBoard.length - 2; i < gBoard.length - 1; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].gameObject === ALIEN) {
                clearInterval(gIntervalAliensDown)
                clearInterval(gIntervalAliensLeft)
                clearInterval(gIntervalAliensRight)
                return true
            }
        }
    }
    return false
}

function freezeAliens() {
    gIsAlienFreeze = true
    clearInterval(gIntervalAliensDown)
    clearInterval(gIntervalAliensLeft)
    clearInterval(gIntervalAliensRight)
}