import { useEffect, useRef, useState } from "react";
import Peer, { DataConnection } from "peerjs";
import useWebSocket from "react-use-websocket";
import { v4 as uuid } from "uuid";
import { ConnectionRequest, FileSharingMessage } from "../type";

const WS_URL = "ws://localhost:3000";



export const usePeerConnection = () => {
    const [peerId, setPeerId] = useState("");
    const [receivedImage, setReceivedImage] = useState<string | null>(null);
    const [chunkList, setChunkList] = useState<Uint8Array[]>([]);
    const [connection, setConnection] = useState<DataConnection | null>(null);
    const [connectionRequest, setConnectionRequest] =
        useState<ConnectionRequest | null>(null);
    const [remoteConnectionInfo, setRemoteConnectionInfo] = useState<ConnectionRequest | null>(null);
    const peer = useRef<Peer | null>(null);
    const [peerConnectionState, setPeerConnectionState] = useState<RTCIceConnectionState>();

    const { sendMessage, readyState } = useWebSocket(WS_URL, {
        shouldReconnect: () => true,
        onMessage: (message) => {
            const request = JSON.parse(message.data.toString());
            if (!remoteConnectionInfo) {
                setConnectionRequest(request);
            }
        },
    });



    const receiveChunk = (data: any) => {
        if ((data as FileSharingMessage).type === "chunk") {
            setChunkList((prev) => [...prev, data.data]);
        } else if ((data as FileSharingMessage).type === "end") {
            setChunkList((prevChunks) => {
                if (prevChunks.length === 0) return prevChunks; // Prevent processing an empty list
    
                const blob = new Blob(prevChunks, { type: "image/jpeg" });
                setReceivedImage(URL.createObjectURL(blob));
    
                return []; // Reset chunk list
            });
        }
    };
    

    useEffect(() => {
        if (!peer.current) {
            peer.current = new Peer(uuid(), {
                config: {
                    iceServers: [
                        { urls: "stun:stun.l.google.com:19302" },
                        { urls: "stun:stun.services.mozilla.com" },
                    ],
                },
            });

            peer.current.on("open", (id) => setPeerId(id));

            peer.current.on("connection", (conn) => {
                conn.on("data", (data) => {
                    receiveChunk(data);
                });
                setConnection(conn);
            });

            peer.current.on("error", (err) => console.log(err));
        }
    }, []);




    const sendConnectionRequest = (request: ConnectionRequest) => {
        sendMessage(JSON.stringify(request));
    };

    const acceptConnectionRequest = (name: string) => {
        if (connectionRequest && peer.current) {
            const conn = peer.current.connect(connectionRequest.peerId);

            conn.on("open", () => {  // Ensure connection is established before setting state
                setConnection(conn);
                setRemoteConnectionInfo(connectionRequest);
                setConnectionRequest(null);

                // Inform the remote peer about this connection
                sendConnectionRequest({
                    id: uuid(),
                    name: name,
                    peerId: peerId
                });
            });

            conn.on("iceStateChanged", (state) => {
                setPeerConnectionState(state);
            })

            conn.on("data", (data) => {
                receiveChunk(data);
            });

            conn.on("error", (err) => console.log("Connection error:", err));
        }
    };


    const sendFileToPeer = (file: File) => {
        if (connection) {
            const chunkSize = 16 * 1024; // 16KB per chunk
            let offset = 0;
            const reader = new FileReader();

            const sendChunk = () => {
                if (offset >= file.size) {
                    connection.send({ type: "end" }); // Indicate transfer completion
                    return;
                }
                const chunk = file.slice(offset, offset + chunkSize);
                reader.readAsArrayBuffer(chunk);
                reader.onload = () => {
                    if (reader.result) {
                        connection.send({ type: "chunk", data: reader.result });
                        offset += chunkSize;
                        setTimeout(sendChunk, 10);
                    }
                };
            };

            sendChunk();
        }
    };




    return {
        peerId,
        remoteConnectionInfo,
        receivedImage,
        sendConnectionRequest,
        acceptConnectionRequest,
        sendFileToPeer,
        connectionRequest,
        readyState,
        peerConnectionState,
        isFileComing: chunkList.length > 0,
    };
};
