# VideoCall
JS WebRTC video chat client + relay server. Made to drive a tele-presence roomba robot via a web UI.

# Usage
Plug the serial cable from the roomba into the iRobot and the other end into the machine that runs the 'robot_server'. 'npm run dev' in the robot server folder on that machine will start the serial control server. That will then connect to the 'server' which can be started by the same command, make sure the 'robot_server' points to this address. Finally start the frontend by running the same command in the root folder, make sure it points to the server. This requires NPM 10, and should run fine on any OS including ARM.

The Socket.io connect lines in the drive.js and video_call.js are what need to point at the 'server'. The 'server' and 'frontend' can run on any machine & network as long as they are publicly accessible by all clients and the 'robot_server'.

# Architecture
3 servers. Frontend Next.js server, backend Express.js 'server', and backend Express.js 'robot_server' for robot serial commands. The frontend displays a webRTC video, audio, text live stream connection and uses the 'server' to build contacts lists and handle NAT traversal between clients. The 'server' also acts as a message forwarded between clients and the robot_server. The robot server will transalte keyup/down events into motor commands to actually drivie the iRobot around via a web UI.

![Connection UI](https://i.imgur.com/HtJi74m.png)

When streaming, you get a chat, a video feed, and a drive controls menu

![Streaming UI](https://i.imgur.com/Qh6vO9a.png)
