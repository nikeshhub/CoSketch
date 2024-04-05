import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog.tsx";
import { AiOutlineShareAlt } from "react-icons/ai";
import { Button } from "@/components/ui/button.tsx";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/authContext.tsx";
import { toast } from "sonner";
import { SESSION_CREATE_ENDPOINT } from "@/api/apiLinks.tsx";
import { ManagerOptions, SocketOptions, io } from "socket.io-client";

const server = "http://localhost:8000";
const connectionOptions: Partial<ManagerOptions & SocketOptions> = {
  forceNew: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
  autoConnect: false,
};

const socket = io(server, connectionOptions);
const StartSession: React.FC = () => {
  const sessionID = nanoid();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  });

  const handleCreateSession = async () => {
    try {
      const sessionData = {
        session_name: currentUser.name + "'s Session",
        session_code: sessionID,
        created_by: currentUser.id,
      };
      // console.log(sessionData);
      const response = await axios.post(SESSION_CREATE_ENDPOINT, sessionData);
      if (response.data.data.created_by === currentUser.id) {
        const previousElements = JSON.parse(
          localStorage.getItem("elements") || "[]"
        );
        // console.log("Elements in local", previousElements);
        socket.emit("previousElements", sessionID, previousElements);
      }

      navigate(`/session/${sessionID}`);
    } catch (error) {
      console.error("Error sending data to server:", error);
      toast.error("Error registering");
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md w-100 h-50">
          <AiOutlineShareAlt className="mr-2" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-5 text-indigo-500">
            Live collaboration
          </DialogTitle>
          <DialogDescription className="text-center">
            Invite people to collaborate on your drawing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-center">
            Don't worry, the session is end-to-end encrypted, and fully private.
            Not even our server can see what you draw.
          </div>
          <button
            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            onClick={handleCreateSession}
          >
            Start session
          </button>
          <div className="flex justify-between items-center width-1/2">
            <div className="text-sm text-gray-500">Or</div>
          </div>
          <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">
            Export to Link
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartSession;
