# Peer-to-Peer File Sharing App

This is a React-based Peer-to-Peer (P2P) file-sharing application that utilizes WebRTC and PeerJS for real-time file transfer between connected peers.

## Features
- Establishes a peer-to-peer connection using WebRTC (via PeerJS)
- Handles connection requests through a WebSocket server
- Allows users to send and receive image files in chunks
- Displays the connection state and received images

## Technologies Used
- **React** for UI components
- **PeerJS** for WebRTC-based P2P connections
- **WebSockets** (via `react-use-websocket`) for signaling
- **MUI** for styling
- **UUID** for unique peer identification

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the application:
   ```sh
   npm start
   ```

## Usage
1. Open the app in your browser.
2. Enter your name and click **Send Request** to connect to another peer.
3. If you receive a connection request, accept it to establish the P2P connection.
4. Once connected, select an image file to send.
5. The recipient will receive the file in chunks and can view it in the UI.

## Project Structure
```
.
├── src
│   ├── components
│   │   ├── PeerUI.tsx (Main UI component)
│   ├── hooks
│   │   ├── usePeerConnection.ts (Handles PeerJS logic)
│   ├── types
│   │   ├── index.ts (Type definitions)
│   ├── App.tsx (Root component)
│   ├── index.tsx (Entry point)
├── public
├── package.json
└── README.md
```

## WebSocket Server (Signaling Server)
This app requires a WebSocket signaling server to exchange connection requests. Run a WebSocket server on `ws://localhost:3000` to enable signaling between peers.

## TODO
- Improve UI with better status indicators
- Support additional file types
- Implement better error handling

## License
This project is open-source and available under the [MIT License](LICENSE).

