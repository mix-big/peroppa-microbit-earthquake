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
    radio.sendString(PGA.toJMASeismicIntensity(PGA.getPGA()))
    basic.showString(PGA.toJMASeismicIntensity(PGA.getPGA()))
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
})
radio.onReceivedString(function (receivedString) {
    basic.showString(receivedString)
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
})
