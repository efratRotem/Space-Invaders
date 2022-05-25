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
            if (i === gHero.pos.i && j === gHero.pos.j) board[i][j] = { type: EARTH, gameObject: HERO }
        }
    }
}

// Handle game keys 
function onKeyDown(ev) {

    var dir

    switch (ev.key) {
        case 'ArrowLeft':
            dir = -1
            break
        case 'ArrowRight':
            dir = 1
            break
        case ' ':
            shoot()
            dir = 0
            break
        default:
            dir = 0
            break
    }
    moveHero(dir)
}

// Move the hero right (1) or left (-1) 
function moveHero(dir) {
    var nextPos = {
        i: gHero.pos.i,
        j: gHero.pos.j + dir
    }

    // console.log('gBoard:', gBoard)
    if (nextPos.j < 0 || nextPos.j > gBoard[0].length - 1) return

    //Update DOM - leaving cell
    renderCell(gHero.pos, '')

    //Update Model - next cell
    gHero.pos.j = nextPos.j

    //Update DOM - next cell
    renderCell(gHero.pos, HERO)
}

// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot() {
    console.log('in shoot:')
    // // var shootInterval = setInterval(blinkLaser, LASER_SPEED, gHero.pos)
    // for (var i = gHero.pos - 1; i >= 0; i--) {
    //     console.log('in loop:' )
    //     var cell = gBoard[i][gHero.pos.j]
    //     if (cell.gameObject === ALIEN) {
    //         cell.gameObject = null

    //         return
    //     }
    // }

    for (var i = gHero.pos.i - 1; i >=0; i--) {
        blinkLaser({ i: i, j: gHero.pos.j })
        
    }


}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {

    // for (var i = pos.i - 1; i >= 0; i--) {
    //     var cell = gBoard[i][pos.j]
    //     if (cell.gameObject === ALIEN) {
    //         cell.gameObject = null
    //         updateCell({ i: i, j: pos.j }, '')
    //         return
    //     }

    updateCell({ i: pos.i, j: pos.j }, LASER)

    setTimeout(updateCell, 1, { i: pos.i, j: pos.j }, '')
    // setTimeout(updateCell, 0, { i: i, j: pos.j }, LASER)
    // setTimeout(updateCell, 0.5, { i: i, j: pos.j }, '')
    // }

}
