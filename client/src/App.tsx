// import React from "react";
// import Navigation from "./components/ui/Navbar";
// import Draw from "./containers/Draw";
// import CanvasComponent from "./containers/CanvasContainer";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
// import CreateSession from "./containers/StartSession";
import SessionPage from "./containers/SessionPage";
import RegisterPage from "./containers/RegisterForm";
import VerifyEmailPage from "./containers/VerifyEmail";
import VerifySuccessPage from "./containers/VerifySuccess";
import Login from "./containers/Login";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import CollaborativeSessionPage from "./containers/CollaborativeSession";
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

const App = () => {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <SessionPage />,
        },
        {
          path: "/session/:sessionID",
          element: <CollaborativeSessionPage socket={socket} />,
        },
      ],
    },

    {
      path: "/signup",
      element: <RegisterPage />,
    },
    {
      path: "/verify",
      element: <VerifyEmailPage />,
    },
    {
      path: "/verify-email",
      element: <VerifySuccessPage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
