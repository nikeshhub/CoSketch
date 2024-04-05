// Navigation.js

import React from "react";
import {
  PiLineSegment,
  PiRectangle,
  PiTextAUnderline,
  PiHand,
  PiSelection,
  PiPencil,
  PiBellFill,
} from "react-icons/pi";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

function Navigation() {
  return (
    <nav>
      <div className=" p-4 container mx-auto flex justify-between items-center absolute top-0 left-10 z-100">
        {/* Logo */}
        <div className="text-black text-lg font-semibold">CO-SKETCH</div>

        {/* Navigation Links */}
        <div className="flex space-x-4 border-2 p-2 rounded-lg shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="icon">
                  <PiHand />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to library</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="outline" size="icon">
            <PiSelection />
          </Button>
          <Button variant="outline" size="icon">
            <PiRectangle />
          </Button>
          <Button variant="outline" size="icon">
            <PiLineSegment />
          </Button>
          <Button variant="outline" size="icon">
            <PiTextAUnderline />
          </Button>
          <Button variant="outline" size="icon">
            <PiPencil />
          </Button>

          {/* <a href="#" className="text-black hover:text-gray-200">
            Features
          </a>
          <a href="#" className="text-black hover:text-gray-200">
            Pricing
          </a>
          <a href="#" className="text-black hover:text-gray-200">
            About
          </a>
          <a href="#" className="text-black hover:text-gray-200">
            Contact
          </a> */}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          
          <Button
            variant="outline"
            size="icon"
            className="rounded-3xl"
            // className="bg-gray-200 text-black-500 hover:bg-gray-300  rounded-md"
          >
            <PiBellFill />
          </Button>
          <Button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md w-100 h-50">
            Share
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
