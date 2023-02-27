import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CryptoDetail from "./components/CryptoDetail";
import CryptoList from './components/CryptoList';

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <CryptoList />,
    },
    {
      path: "/crypto/:uuid/:name",
      element: <CryptoDetail />,
    },
  ]);
  return <RouterProvider router={route} />;
}

export default App;
