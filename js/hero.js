'use strict'

const LASER_SPEED = 80

var gHero = {
    pos: { i: 12, j: 5 },
    isShoot: false,
    isShootNeighbors: false,
    isSuperAttack: false,
    superAttacksCount: 3
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
            break
        case 'n':
            gHero.isShootNeighbors = true
            shoot()
            break
        case 'x':
            gHero.isSuperAttack = (gHero.superAttacksCount === 0) ? false : true
            if (gHero.isSuperAttack) shoot()
            break
        default:
            break
    }

    dir = (dir === -1) ? -1 : (dir === 1) ? 1 : 0

    moveHero(dir)
}

// Move the hero right (1) or left (-1) 
function moveHero(dir) {
    if (!gGame.isOn) return

    var nextPos = {
        i: gHero.pos.i,
        j: gHero.pos.j + dir
    }

    if (nextPos.j < 0 || nextPos.j > gBoard[0].length - 1) return

    //Update Model & DOM - leaving cell
    updateCell(gHero.pos)

    //Update HERO position - next cell
    gHero.pos.j = nextPos.j

    //Update Model & DOM - next cell
    updateCell(gHero.pos, HERO)
}

// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot() {

    if (!gGame.isOn) return
    // only one shoot on board
    if (gHero.isShoot) return

    gHero.isShoot = true

    var laserPos = {
        i: gHero.pos.i - 1,
        j: gHero.pos.j
    }

    var laserSpeed = LASER_SPEED

    if (gHero.isSuperAttack) {
        laserSpeed *= 0.5
        gHero.superAttacksCount--
        gHero.isSuperAttack = false
    }

    var blinkInterval = setInterval(() => {
        if (laserPos.i === 0) return
        blinkLaser(laserPos)
        laserPos.i--
        if (gBoard[laserPos.i][laserPos.j].gameObject === ALIEN) {
            updateScore(10)
            gGame.aliensCount--
            if (gHero.isShootNeighbors) {
                shootNeighbors(laserPos)
                gHero.isShootNeighbors = false
            }
        } else if (gBoard[laserPos.i][laserPos.j].gameObject === CANDY) {
            updateScore(50)
        }
        if (gBoard[laserPos.i][laserPos.j].gameObject === ALIEN ||
            gBoard[laserPos.i][laserPos.j].gameObject === CANDY ||
            laserPos.i === 0) {
            clearInterval(blinkInterval)
            updateCell(laserPos, '')
            gHero.isShoot = false
            if (isVictory()) gameOver(true)
        }
    }, laserSpeed)

}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {

    var laser
    laser = (gHero.isSuperAttack) ? SUPER_LASER : LASER

    gBoard[pos.i][pos.j].gameObject = laser
    updateCell({ i: pos.i, j: pos.j }, laser)

    gBoard[pos.i][pos.j].gameObject = ''
    setTimeout(updateCell, LASER_SPEED, { i: pos.i, j: pos.j })
}

function shootNeighbors(pos) {
    var countAliens = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (gBoard[i][j].gameObject === ALIEN) countAliens++
            updateCell({ i, j })
        }
    }
    gGame.aliensCount -= countAliens
    console.log('countAliens:', countAliens)
    // score for the alien in cell {i:j} and his neighbors
    updateScore((countAliens) * 10)
}

function updateHero() {
    gHero.superAttacksCount = 3
}