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
	
})
function 震度表示 () {
    if (250 <= PGA.getPGA() && 400 > PGA.getPGA()) {
        basic.showLeds(`
            # # # . .
            # . . . .
            # # . # #
            . . # . .
            # # . . .
            `)
    } else if (400 <= PGA.getPGA() && 600 > PGA.getPGA()) {
        basic.showLeds(`
            # # # . .
            # . . # .
            # # # # #
            . . # # .
            # # . . .
            `)
    } else if (600 <= PGA.getPGA() && 900 > PGA.getPGA()) {
        basic.showLeds(`
            . . # . .
            . # . . .
            # # . # #
            # . # . .
            . # . . .
            `)
    } else if (900 <= PGA.getPGA() && 1400 > PGA.getPGA()) {
        basic.showLeds(`
            . . # . .
            . # . # .
            # # # # #
            # . # # .
            . # . . .
            `)
    } else {
        basic.showString(PGA.toJMASeismicIntensity(PGA.getPGA()))
    }
}
basic.forever(function () {
    震度表示()
})
