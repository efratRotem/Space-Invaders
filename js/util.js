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

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}