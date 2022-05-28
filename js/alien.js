'use strict'

var ALIEN_SPEED = 500

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
    for (var i = 0; i < gAliensRowCount; i++) {
        for (var j = 0; j < gAliensRowLength; j++) {
            board[i][j] = { type: SKY, gameObject: ALIEN }
        }
    }
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = gAliensRowCount - 1
}

function handleAlienHit(pos) {
    // If an ALIEN hit a LASER
    if (gBoard[pos.i][pos.j].gameObject === LASER) {
        updateCell(pos, '')
        gGame.aliensCount--
        console.log(' gGame.aliensCount--:', gGame.aliensCount--)
        clearInterval(gBlinkInterval)
    }
}

function shiftBoardRight(board, fromI, toI) {
    if (!gCanShiftRight) return
    if (gCanShiftDown) return

    var oldBoard = copyBoard(board)

    for (var i = fromI; i <= toI; i++) {
        for (var j = 0; j <= board[0].length - 1; j++) {
            // Cells in first column should be with gameObject = null
            board[i][j] = (j === 0) ? createCell() : oldBoard[i][j - 1]

            // If an ALIEN hit a LASER
            handleAlienHit({ i, j })

            // Cells in first row, that are Candy, should stay Candy and not be shifted
            if (oldBoard[i][j].gameObject === CANDY) board[i][j] = oldBoard[i][j]

            // Stop moving right - when an alien in the last board column
            if (board[i][board[0].length - 1].gameObject === ALIEN) {
                clearInterval(gIntervalAliensRight)
                gCanShiftRight = false
                gCanShiftLeft = true
                gCanShiftDown = true
            }
        }
    }
    renderBoard(board)
}

function shiftBoardLeft(board, fromI, toI) {
    if (!gCanShiftLeft) return
    if (gCanShiftDown) return
    var oldBoard = copyBoard(board)

    for (var i = fromI; i <= toI; i++) {
        for (var j = board[0].length - 1; j >= 0; j--) {

            // Cells in last column should be with gameObject = null
            board[i][j] = (j === board[0].length - 1) ? createCell() : oldBoard[i][j + 1]

            // If an ALIEN hit a LASER
            handleAlienHit({ i, j })

            // Cells in first row, that are Candy, should stay Candy and not be shifted
            if (oldBoard[i][j].gameObject === CANDY) board[i][j] = oldBoard[i][j]


            // Stop moving left - when an alien in the first board column
            if (board[i][0].gameObject === ALIEN) {
                gCanShiftLeft = false
                gCanShiftRight = true
                gCanShiftDown = true
                clearInterval(gIntervalAliensLeft)
            }
        }
    }
    renderBoard(board)
}

function shiftBoardDown(board, fromI, toI) {
    if (!gCanShiftDown) return

    var oldBoard = copyBoard(board)

    for (var i = fromI; i < toI + 2; i++) {
        for (var j = 0; j < oldBoard[0].length; j++) {
            if (oldBoard[i][j].gameObject === CANDY) {
                board[i][j] = oldBoard[i][j]
            } else {
                board[i][j] = (i - 1 < 0) ? createCell() : oldBoard[i - 1][j]
            }

            // If an ALIEN hit a LASER
            handleAlienHit({ i, j })
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

    gIntervalAliensDown = setInterval(shiftBoardDown, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    gIntervalAliensRight = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
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
    var elBtnFreezeAliens = document.querySelector('.freezing-aliens')
    if (!gIsAlienFreeze) {
        gIsAlienFreeze = true
        clearInterval(gIntervalAliensDown)
        clearInterval(gIntervalAliensLeft)
        clearInterval(gIntervalAliensRight)
        elBtnFreezeAliens.innerText = 'UnFreezing Aliens'
    } else {
        gIsAlienFreeze = false
        moveAliens()
        elBtnFreezeAliens.innerText = 'Freezing Aliens'
    }
}