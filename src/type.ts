export type ConnectionRequest = {
    id: string,
    peerId: string,
    name: string
}
export type FileSharingMessage = {
    type: "chunk",
    data: Uint8Array
} | {
    type: "end"
}