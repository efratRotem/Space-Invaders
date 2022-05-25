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
    }
    console.log('dir:',dir)
    moveHero(dir)
}

// Move the hero right (1) or left (-1) 
function moveHero(dir) {
    var nextPos = {
        i: gHero.pos.i,
        j: gHero.pos.j + dir
    }
    console.log('nextPos:',nextPos)
    return nextPos
}

// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot() {

}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {

}