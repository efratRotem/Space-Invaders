'use strict'

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN} 
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function getElCell(pos) {
    return document.querySelector(`.cell-${pos.i}-${pos.j}`)
}

function renderCell(pos, value) {
    var elCell = getElCell(pos)
    elCell.innerText = value
}

function copyBoard(board) {
    var newBoard = []
    for (var i = 0; i < board.length; i++) {
        newBoard[i] = []
        for (var j = 0; j < board[0].length; j++) {
            newBoard[i][j] = board[i][j]
        }
    }
    return newBoard
}

function copyPartBoard(board, fromI, toI) {
    var newBoard = []
    for (var i = fromI; i <= toI; i++) {
        newBoard[i] = []
        for (var j = 0; j < board[0].length; j++) {
            newBoard[i][j] = board[i][j]
        }
    }
    return newBoard
}

//Find empty cell, only in the first row
function getEmptyCell(board) {

    var emptyCells = []

    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]

            if (!cell.gameObject) emptyCells.push({ cell, i, j })
        }
    }
    // console.log('emptyCells:', emptyCells)

    var idx = getRandomIntInclusive(0, emptyCells.length - 1)
    cell = emptyCells[idx]
    // console.log('cell:', cell)
    return cell
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}