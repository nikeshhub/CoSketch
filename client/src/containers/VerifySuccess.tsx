import { USER_VERiFY_ENDPOINT } from "@/api/apiLinks";
import axios from "axios";
import React, { useEffect } from "react";
import { PiCheckCircleBold } from "react-icons/pi"; // Adjust the import path based on the actual icon you're using
import { useParams } from "react-router-dom";

function VerifySuccessPage() {
  const { token } = useParams();
  console.log(token);
  const handleVerify = async (token: string) => {
    console.log("token in handleverify", token);
    try {
      //   const bearerToken = { token: token };
      const response = await axios.post(USER_VERiFY_ENDPOINT, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log(token);
    handleVerify(token);
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-md rounded-lg p-12">
        <h2 className="text-2xl font-bold text-center mb-6">
          Email Verified Successfully
        </h2>
        <p className="flex justify-center items-center">
          <PiCheckCircleBold className="text-green-500" size={80} />
        </p>
        <p className="text-center">
          Your email has been successfully verified. You can now log in to your
          account.
        </p>
        <div className="text-center">
          <a
            href="/login"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default VerifySuccessPage;
