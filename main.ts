function 地震検出 () {
    basic.showLeds(`
        . . . . .
        . # . . .
        # . # . #
        . . . # .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . # . # .
        # . . . #
        . . # . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . # . # .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . . . # .
        # . # . #
        . # . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . . # . .
        # . . . #
        . # . # .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . # . # .
        # . # . #
        . . . . .
        . . . . .
        `)
}
input.onGesture(Gesture.Shake, function () {
    地震検出()
    while (!(PGA.getPGA() < 2.5)) {
        radio.sendString("")
    }
})
