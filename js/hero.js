'use strict'

const LASER_SPEED = 80

var gHero = {
    pos: { i: 12, j: 5 },
    isShoot: false
}

// creates the hero and place it on board 
function createHero(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (i === gHero.pos.i && j === gHero.pos.j) board[i][j] = HERO
        }
    }
}

// Handle game keys 
function onKeyDown(ev) {

    var dir

    switch (ev.key) {
        case 'ArrowLeft':
            dir = -1
            break;

        case 'ArrowRight':
            dir = 1
            break;
        default:
            dir = 0
            break
    }
    moveHero(dir)
    console.log(' gHero.pos.j :', gHero.pos.j)
}

// Move the hero right (1) or left (-1) 
function moveHero(dir) {
    var nextPos = {
        i: gHero.pos.i,
        j: gHero.pos.j + dir
    }

    if (nextPos.j < 0 || nextPos.j > gBoard[0].length - 1) return

    //DOM - leaving cell
    var elCell = getElCell(gHero.pos)
    elCell.innerText = ''
    
    //Model - next cell
    gHero.pos.j = nextPos.j
    
    //DOM - next cell
    var elCell = getElCell(gHero.pos)
    elCell.innerText = HERO
}

// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot() {

}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {

}