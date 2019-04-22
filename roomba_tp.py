from pycreate2 import Create2
import time

from Tkinter import *
import os
import signal

os.system('xset r off')
main = Tk()

def sigint_handler(sig, frame):
    main.quit()

signal.signal(signal.SIGINT, sigint_handler)

# BOT INIT
port = '/dev/ttyUSB0'
baud = 115200
bot = Create2(port, baud)
bot.start()
bot.safe()

isSprint = False
isL = False
isR = False
isFwd = False
isRev = False

left = 200
right = 200

def stateMngr():
    global left, right, isL, isR, isFwd, isRev, isSprint
    # Left + Fwd
    if isL == True and isFwd == True:
        left = 250
        right = 150

    # Right + Fwd
    if isR == True and isFwd == True:
        left = 150
        right = 250

    # Left + Rev
    if isL == True and isRev == True:
        left = -250
        right = -150

    # Right + Rev
    if isR == True and isRev == True:
        left = -150
        right = -250

    # Left Only
    if isL == True and isFwd == False and isRev == False:
        left = 125
        right = -125

    # Right only
    if isR == True and isFwd == False and isRev == False:
        left = -125
        right = 125

    # Forward only
    if isFwd == True and isL == False and isR == False:
        left = 200
        right = 200

    # Reverse only
    if isRev == True and isL == False and isR == False:
        left = -200
        right = -200

    # nothing or something
    if isRev == False and isFwd == False and isR == False and isL == False:
        bot.drive_stop()
    else:
        if isSprint == True:
            bot.drive_direct(left * 2.5, right * 2.5)
        else:
            bot.drive_direct(left, right)

def leftKey(event):
    global isL
    isL = True
    stateMngr()

def rightKey(event):
    global isR
    isR = True
    stateMngr()

def upKey(event):
    global isFwd
    isFwd = True
    stateMngr()

def downKey(event):
    global isRev
    isRev = True
    stateMngr()

def shiftKey(event):
    global isSprint
    isSprint = True
    stateMngr()

def releaseUpKey(event):
    global isFwd
    isFwd = False
    stateMngr()

def releaseDownKey(event):
    global isRev
    isRev = False
    stateMngr()

def releaseLeftKey(event):
    global isL
    isL = False
    stateMngr()

def releaseRightKey(event):
    global isR
    isR = False
    stateMngr()

def releaseShiftKey(event):
    global isSprint
    isSprint = False
    stateMngr()

frame = Frame(main, width=300, height=500)
main.bind('<Left>', leftKey)
main.bind('<Right>', rightKey)
main.bind('<Up>', upKey)
main.bind('<Down>', downKey)
main.bind('<Shift_L>', shiftKey)
main.bind('<KeyRelease-Up>', releaseUpKey)
main.bind('<KeyRelease-Down>', releaseDownKey)
main.bind('<KeyRelease-Left>', releaseLeftKey)
main.bind('<KeyRelease-Right>', releaseRightKey)
main.bind('<KeyRelease-Shift_L>', releaseShiftKey)
frame.pack()

main.mainloop()

print('shutting down ... bye')
bot.drive_stop()
time.sleep(0.1)

os.system('xset r on')
