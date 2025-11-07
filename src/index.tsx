import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Onboarding from './pages/onboarding/Onboarding';
import Chat from './pages/chat/Chat';
import App from './App';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
