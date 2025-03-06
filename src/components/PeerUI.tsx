import React, { useState } from "react";
import { usePeerConnection } from "../hooks/usePeerConnection";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";

const PeerUI: React.FC = () => {
  const {
    peerId,
    remoteConnectionInfo,
    receivedImage,
    peerConnectionState,
    sendConnectionRequest,
    acceptConnectionRequest,
    sendFileToPeer,
    connectionRequest,
    isFileComing,
  } = usePeerConnection();

  const [name, setName] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      sendFileToPeer(event.target.files[0]);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={3}
    >
      {connectionRequest && (
        <Card sx={{ maxWidth: 400, p: 2 }}>
          <CardContent>
            <Typography variant="h6">Incoming Connection Request</Typography>
            <Typography>ID: {connectionRequest.id}</Typography>
            <Typography>Name: {connectionRequest.name}</Typography>
            <Typography>Peer ID: {connectionRequest.peerId}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={() => {
                if (name) {
                  acceptConnectionRequest(name);
                } else {
                  alert("Please enter your name");
                }
              }}
            >
              Accept Connection
            </Button>
          </CardContent>
        </Card>
      )}

      {remoteConnectionInfo && (
        <>
          <Card sx={{ maxWidth: 400, p: 2 }}>
            <CardContent>
              <Typography variant="h6">Remote Connection Info</Typography>
              <Typography>ID: {remoteConnectionInfo.id}</Typography>
              <Typography>Name: {remoteConnectionInfo.name}</Typography>
              <Typography>Peer ID: {remoteConnectionInfo.peerId}</Typography>
            </CardContent>
          </Card>
        </>
      )}

      <Typography variant="h4">P2P File Transfer</Typography>
      <Typography>Your ID: {peerId}</Typography>
      <Typography>Your Name: {name}</Typography>

      {!peerConnectionState && (
        <TextField
          label="Enter your name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      {peerConnectionState !== "connected" && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            if (name) {
              sendConnectionRequest({ id: "kp", peerId, name: name });
            } else {
              alert("Please enter your name");
            }
          }}
        >
          Send Request
        </Button>
      )}

      {peerConnectionState && (
        <Box mt={2}>
          <Typography>Peer Connection State: {peerConnectionState}</Typography>
          {peerConnectionState === "connected" && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <input
                type="file"
                accept="image/jpeg"
                onChange={handleFileChange}
              />
              {receivedImage && (
                <img src={receivedImage} alt="Received File" width="200" />
              )}
            </Box>
          )}
        </Box>
      )}

      {isFileComing && (
        <Typography variant="h6">Receiving File...</Typography>
      )}
    </Box>
  );
};

export default PeerUI;
