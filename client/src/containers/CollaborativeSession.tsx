import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
  PiCircle,
  PiCopy,
  PiLineSegment,
  PiPencil,
  PiRectangle,
  PiTextAUnderline,
  PiTrash,
} from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/authContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Toaster, toast } from "sonner";
import { SESSION_DELETE_ENDPOINT, SESSION_GET_ENDPOINT } from "@/api/apiLinks";
import axios from "axios";
import SessionNotFound from "./SessionDetailNotFound";

interface Element {
  type: string;
  offsetX: number;
  offsetY: number;
  path: [number, number][];
}

interface CollaborativeSessionPageProps {
  socket: Socket;
}

const CollaborativeSessionPage: React.FC<CollaborativeSessionPageProps> = ({
  socket,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  console.log("AccessToken:", token);
  console.log("ji");
  const { sessionID } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [type, setType] = useState<string>("line");
  const [sessionNotFound, setSessionNotFound] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({});
  const [element, setElement] = useState<Element[]>([]);
  const [draw, setDraw] = useState(false);
  const [cursorPositions, setCursorPositions] = useState<{
    [socketId: string]: { x: number; y: number; name: string };
  }>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctxRef.current = ctx;
      }
    }

    socket.connect();

    if (sessionID) {
      socket.emit("joinSession", sessionID, currentUser.name);
    }

    socket.on("updateElements", (data: Element[]) => {
      setElement(data);
    });

    socket.on("sessionDeleted", (deletedSessionID) => {
      console.log("delete socket connected on frnot");
      if (deletedSessionID === sessionID) {
        setSessionNotFound(true);
      }
    });

    socket.on("cursor", (data) => {
      setCursorPositions((prevPositions) => ({
        ...prevPositions,
        [data.socketId]: { x: data.x, y: data.y, name: data.name },
      }));
    });

    socket.on("notification", (message) => {
      toast(message, { position: "top-center" });
    });

    return () => {
      socket.off("updateElements");
      socket.off("cursor");
      socket.off("sessionDeleted");
      socket.off("notification");
      socket.disconnect();
    };
  }, [currentUser.name, sessionID, socket]);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        if (sessionID) {
          const session = await axios.get(SESSION_GET_ENDPOINT(sessionID));
          setSessionDetails(session.data.data);
        }
      } catch (error) {
        console.log(error);
        setSessionNotFound(true);
      }
    };
    fetchSessionDetails();
  }, [sessionID, currentUser]);

  useLayoutEffect(() => {
    if (ctxRef.current) {
      const ctx = ctxRef.current as CanvasRenderingContext2D;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      element.forEach((el) => {
        ctx.beginPath();
        ctx.moveTo(el.offsetX, el.offsetY);
        if (el.type === "line" || el.type === "pencil") {
          el.path.forEach((point) => {
            ctx.lineTo(point[0], point[1]);
          });
          ctx.stroke();
        } else if (el.type === "rectangle") {
          const lastPoint = el.path[el.path.length - 1];
          ctx.rect(
            el.offsetX,
            el.offsetY,
            lastPoint[0] - el.offsetX,
            lastPoint[1] - el.offsetY
          );
          ctx.stroke();
        } else if (el.type === "circle") {
          const lastPoint = el.path[el.path.length - 1];
          const radius = Math.sqrt(
            Math.pow(lastPoint[0] - el.offsetX, 2) +
              Math.pow(lastPoint[1] - el.offsetY, 2)
          );
          ctx.beginPath();
          ctx.arc(el.offsetX, el.offsetY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      });
      Object.entries(cursorPositions).forEach(([socketId, { x, y, name }]) => {
        if (socketId !== socket.id) {
          ctx.font = "16px Roboto";
          ctx.fillStyle = "red";
          ctx.fillText(name, x + 10, y - 10);
        }
      });
    }
  }, [cursorPositions, element, socket.id]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    const newElement: Element = {
      type,
      offsetX,
      offsetY,
      path: [[offsetX, offsetY]],
    };
    setElement((prev) => [...prev, newElement]);

    setDraw(true);
  };

  const handleMouseUp = () => {
    setDraw(false);
    // Emit the drawing data when the mouse is released
    if (element.length > 0) {
      const canvasDrawings = canvasRef.current?.toDataURL();
      if (canvasDrawings) {
        socket.emit("draw", sessionID, {
          type,
          offsetX: element[element.length - 1].offsetX,
          offsetY: element[element.length - 1].offsetY,
          path: element[element.length - 1].path,
        });
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (draw && type === "line") {
      setElement((prev) => {
        const newElements = [...prev];
        const lastElement = newElements[newElements.length - 1];
        const newPath = [
          [lastElement.offsetX, lastElement.offsetY] as [number, number],
          [offsetX, offsetY] as [number, number],
        ];
        newElements[newElements.length - 1] = { ...lastElement, path: newPath };

        return newElements;
      });
      console.log(element);
    } else if (draw) {
      setElement((prev) => {
        const newElements = [...prev];
        const lastElement = newElements[newElements.length - 1];
        const newPath = [
          ...lastElement.path,
          [offsetX, offsetY] as [number, number],
        ];
        newElements[newElements.length - 1] = { ...lastElement, path: newPath };

        return newElements;
      });
    }
    socket.emit("cursor", sessionID, {
      x: offsetX,
      y: offsetY,
      name: currentUser?.name,
    });
  };

  const handleClearCanvas = () => {
    setElement([]);
    socket.emit("clearCanvas", sessionID);
  };

  const handleStopSharing = async () => {
    try {
      if (sessionID) {
        const response = await axios.delete(
          SESSION_DELETE_ENDPOINT(sessionID),

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setSessionNotFound(true);
      }
      socket.emit("deleteSession", sessionID);
    } catch (error) {
      console.log("Error on delete", error);
      toast.error(error.response.data.message);
    }

    // navigate("/");
  };

  if (sessionNotFound) {
    return <SessionNotFound />;
  }

  return (
    <div>
      <Toaster richColors />

      <div className="p-4 container mx-auto flex justify-between items-center absolute top-0 left-10 z-100">
        <div
          className="text-black text-lg font-semibold cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          CoSketch
        </div>
        <div>
          <div className="flex space-x-4 border-2 p-2 rounded-lg shadow-md">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setType("rectangle")}
            >
              <PiRectangle />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setType("line")}
            >
              <PiLineSegment />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setType("text")}
            >
              <PiTextAUnderline />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setType("pencil")}
            >
              <PiPencil />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setType("circle")}
            >
              <PiCircle />
            </Button>
          </div>
          <div className=" text-center bg-gray-100 rounded-lg">
            You are drawing{" "}
            <span className="font-bold text-purple-500">{type}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-3xl"
            onClick={handleClearCanvas}
          >
            <PiTrash />
          </Button>
          <Button variant="outline" onClick={handleStopSharing}>
            Stop Sharing
          </Button>
        </div>
      </div>

      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={window.innerWidth}
        height={window.innerHeight}
      />

      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-md shadow-md">
        <p className="mb-2">Share this link to collaborate:</p>
        <input
          type="text"
          value={`${window.location.origin}/session/${sessionID}`}
          readOnly
          className="border p-2 rounded-md"
        />
        <CopyToClipboard
          text={`${window.location.origin}/session/${sessionID}`}
          onCopy={() => toast.success("Link copied successfully")}
        >
          <Button variant="outline" size="icon">
            <PiCopy />
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default CollaborativeSessionPage;
