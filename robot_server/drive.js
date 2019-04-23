const express = require('express')
const create = require('create2')

const app = express()
const port = 3002

let robot = null;
create.prompt((port) => {
  robot = create.open(port, ()=> {
    robotInit();
  });
});

const io = require('socket.io-client');
let socket = io('http://localhost:3001');
socket.on('connect', client => {
    console.log('someone connected');
});

let canDrive = false;
function robotInit() {
  robot.safe();
  canDrive = true;
}

let isSprint = false;
let isL = false;
let isR = false;
let isFwd = false;
let isRev = false;
socket.on('keyup', (responce) => {
  console.log('keyup', responce.key);
  if(responce.key == 'KeyW') {
    isFwd = false;
    stateMngr();
  } else if(responce.key == 'KeyA') {
    isR = false;
    stateMngr();
  } else if(responce.key == 'KeyD') {
    isL = false;
    stateMngr();
  } else if(responce.key == 'KeyS') {
    isRev = false;
    stateMngr();
  } else if(responce.key == 'ShiftRight') {
    isSprint = false;
    stateMngr();
  }
});

socket.on('keydown', (responce) => {
  console.log('keydown', responce.key);
  if(responce.key == 'KeyW') {
    isFwd = true;
    stateMngr();
  } else if(responce.key == 'KeyA') {
    isR = true;
    stateMngr();
  } else if(responce.key == 'KeyD') {
    isL = true;
    stateMngr();
  } else if(responce.key == 'KeyS') {
    isRev = true;
    stateMngr();
  } else if(responce.key == 'ShiftRight') {
    isSprint = true;
    stateMngr();
  }
});

let left = 200;
let right = 200;

function stateMngr() {
  if(!canDrive)
    return;

  // left + fwd
  if (isL == true && isFwd == true) {
    left = 250;
    right = 150;
  }

  // right + fwd
  if (isR == true && isFwd == true) {
    left = 150;
    right = 250;
  }

  // left + rev
  if (isL == true && isRev == true) {
      left = -250;
      right = -150;
  }

  // right + rev
  if(isR == true && isRev == true) {
    left = -150;
    right = -250;
  }

  // left only
  if (isL == true && isFwd == false && isRev == false) {
    left = 125;
    right = -125;
  }

  // right only
  if(isR == true && isFwd == false && isRev == false) {
    left = -125;
    right = 125;
  }

  // forward only
  if(isFwd == true && isL == false && isR == false) {
    left = 200;
    right = 200;
  }

  // reverse only
  if(isRev == true && isL == false && isR == false) {
    left = -200;
    right = -200;
  }

  // nothing or something
  if(isRev == false && isFwd ==false && isR == false && isL==false) {
    robot.driveSpeed(0,0);
  } else {
    if (isSprint == true) {
        robot.driveSpeed(left * 2.5, right * 2.5);
    } else {
        robot.driveSpeed(left, right);
    }
  }
}

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
