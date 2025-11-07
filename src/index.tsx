import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Onboarding from './pages/onboarding/Onboarding';
import App from './App';
import HomePage from './pages/HomePage';
import ChatPageTest from './pages/chat/ChatPageTest';

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
        path: 'test',
        element: <ChatPageTest />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
