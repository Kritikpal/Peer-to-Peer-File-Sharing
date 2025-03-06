import Peer from "peerjs";
import { useEffect, useState } from "react";

export function usePear() {
  const [peer, setPeer] = useState<Peer | null>(null);
  useEffect(() => {
    const newPeer = new Peer("123", {
      config: {
        
      },
    });
    newPeer.on("open", (id) => {
      console.log(id);
    })
    setPeer(newPeer);
  });
  return {
    peer
  };
}
