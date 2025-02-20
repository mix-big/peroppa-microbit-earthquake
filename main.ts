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
        . . . # .
        # . # . #
        . # . . .
        . . . . .
        `)
}
input.onGesture(Gesture.Shake, function () {
    地震検出()
    while (!(PGA.getPGA() == 0)) {
        radio.sendString(PGA.toJMASeismicIntensity(PGA.getPGA()))
        震度表示()
        basic.showNumber(PGA.toLongPeriodSeismicIntensity(PGA.getPGA()))
        if (PGA.isJMASeismicAbove(PGA.getPGA(), "5-")) {
            basic.showLeds(`
                . . # . .
                . . # . .
                . . # . .
                . . . . .
                . . # . .
                `)
            music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        }
    }
})
radio.onReceivedString(function (receivedString) {
    basic.showString(receivedString)
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
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
