basic.forever(function () {
    radio.sendString(PGA.toJMASeismicIntensity(PGA.getPGA()))
})
