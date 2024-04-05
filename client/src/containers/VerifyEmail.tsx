
import { PiEnvelopeFill } from "react-icons/pi";

function VerifyEmailPage() {

    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-md rounded-lg p-6">
        <p className="flex justify-center items-center">
          <PiEnvelopeFill className="text-black-500" size={80} />
        </p>
        <h2 className="text-2xl font-bold text-center mb-6">
          Verify Your Email
        </h2>
        <p className="text-center">
          A verification link has been sent to your email address. Please check
          your inbox and click on the link to verify your email.
        </p>
        <p className="text-center">
          If you haven't received the email, please check your spam folder or
          try resending the verification link.
        </p>
        <div className="text-center">
          <a href="#" className="text-blue-500 hover:text-blue-700">
            Resend Verification Link
          </a>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
