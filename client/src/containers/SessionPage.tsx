import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  PiCircle,
  PiHand,
  PiLineSegment,
  PiPencil,
  PiRectangle,
  PiTextAUnderline,
  PiTrash,
} from "react-icons/pi";
import { Separator } from "@/components/ui/separator";
import StartSession from "./StartSession";
import Logout from "./Logout";
import { Textarea } from "@/components/ui/textarea";
// import { Socket } from "socket.io-client";

interface Element {
  type: string;
  offsetX: number;
  offsetY: number;
  path: [number, number][];
  stroke?: string;
  text: string;
}

// interface SessionPageProps {
//   socket: Socket;
// }

const SessionPage: React.FC = () => {
  const [type, setType] = useState<string>("line");
  const [element, setElement] = useState<Element[]>(() => {
    const storedElements = localStorage.getItem("elements");
    return storedElements ? JSON.parse(storedElements) : [];
  });
  const [draw, setDraw] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);
  const [textareaPosition, setTextareaPosition] = useState({ x: 0, y: 0 });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
  }, []);

  useEffect(() => {
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
        } else if (el.type === "text") {
          ctx.font = "16px Arial";
          ctx.fillText(el.text, el.offsetX, el.offsetY);
        }
      });
    }
  }, [element]);

  useEffect(() => {
    localStorage.setItem("elements", JSON.stringify(element));
  }, [element]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (type === "text") {
      if (!showTextarea) {
        setShowTextarea(true);
        setTextareaPosition({ x: offsetX, y: offsetY });
        console.log(textareaPosition);
      }
    } else {
      setElement((prev) => [
        ...prev,
        { type: type, offsetX, offsetY, path: [[offsetX, offsetY]], text: "" },
      ]);
      setDraw(true);
    }
  };

  const handleMouseUp = () => {
    setDraw(false);
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
  };

  const handleClearCanvas = () => {
    setElement([]);
    localStorage.removeItem("elements");
  };

  const handleTextareaBlur = () => {
    if (type === "text") {
      const text = textAreaRef.current?.value;
      if (text) {
        setElement((prev) => [
          ...prev,
          {
            type: "text",
            offsetX: textareaPosition.x,
            offsetY: textareaPosition.y,
            path: [[textareaPosition.x, textareaPosition.y]],
            text,
          },
        ]);
      }
    }
    setShowTextarea(false);
  };

  return (
    <div>
      <div className="p-4 container mx-auto flex justify-between items-center absolute top-0 left-10 z-100">
        <div className="text-black text-lg font-semibold">CO-SKETCH</div>
        <div>
          <div className="flex space-x-4 border-2 p-2 rounded-lg shadow-md">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setType("select");
              }}
            >
              <PiHand />
            </Button>
            <Separator orientation="vertical" />
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
          <div className="text-center bg-gray-100 rounded-lg">
            You are using{" "}
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
          <StartSession />
          <Logout />
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
      {showTextarea && (
        <div
          className="textarea-container"
          style={{
            position: "absolute",
            left: textareaPosition.x,
            top: textareaPosition.y,
          }}
        >
          <Textarea
            className="border-none"
            ref={textAreaRef}
            placeholder="Type your text here..."
            onBlur={handleTextareaBlur}
          />
        </div>
      )}
    </div>
  );
};

export default SessionPage;
