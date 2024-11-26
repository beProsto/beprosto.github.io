import board
import neopixel
import math

pixels = neopixel.NeoPixel(board.GP23, 1)
# pixels[0] = (10, 0, 0)

neopixmax = 20

def cycle3(x, c):
    return math.sin(x * 2 * math.pi + c * math.pi * 2 / 3) * 0.5 + 0.5

print("Hello, Pico World! :3")

x = 0
while True:
    x = (x + 0.001) % (4*math.pi)
    r = round(cycle3(x, 1) * neopixmax)
    g = round(cycle3(x, 2) * neopixmax)
    b = round(cycle3(x, 3) * neopixmax)
    pixels[0] = (r, g, b)
