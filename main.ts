input.onButtonPressed(Button.A, function () {
    I2C_LCD1602.BacklightOn()
})
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
input.onButtonPressed(Button.B, function () {
    I2C_LCD1602.BacklightOff()
})
I2C_LCD1602.LcdInit(0)
I2C_LCD1602.BacklightOn()
basic.forever(function () {
    radio.sendString(PGA.toJMASeismicIntensity(PGA.getPGA()))
    I2C_LCD1602.ShowString("realtimesindo:" + PGA.toJMASeismicIntensity(PGA.getPGA()), 0, 0)
    if (PGA.toJMASeismicIntensity(PGA.getPGA()).includes("5") || PGA.toJMASeismicIntensity(PGA.getPGA()).includes("6") || PGA.toJMASeismicIntensity(PGA.getPGA()).includes("7")) {
        I2C_LCD1602.ShowString("warning!", 0, 1)
    }
    I2C_LCD1602.clear()
})
