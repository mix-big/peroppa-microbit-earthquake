def 地震検出():
    basic.show_leds("""
        . . . . .
        . # . . .
        # . # . #
        . . . # .
        . . . . .
        """)
    basic.show_leds("""
        . . . . .
        . # . # .
        # . . . #
        . . # . .
        . . . . .
        """)
    basic.show_leds("""
        . . . . .
        . . . . .
        # . # . #
        . # . # .
        . . . . .
        """)
    basic.show_leds("""
        . . . . .
        . . . # .
        # . # . #
        . # . . .
        . . . . .
        """)
    basic.show_leds("""
        . . . . .
        . . # . .
        # . . . #
        . # . # .
        . . . . .
        """)
    basic.show_leds("""
        . . . . .
        . # . # .
        # . # . #
        . . . . .
        . . . . .
        """)

def on_gesture_shake():
    地震検出()
    while not (PGA.get_pga() < 2.5):
        radio.send_string("")
input.on_gesture(Gesture.SHAKE, on_gesture_shake)
