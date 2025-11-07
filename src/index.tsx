import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Onboarding from './pages/onboarding/Onboarding';
import Chat from './pages/chat/Chat';
import App from './App';
import Home from './pages/home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'onboarding',
        element: <Onboarding />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
