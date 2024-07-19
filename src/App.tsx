import React from 'react';
import { createBrowserRouter, RouterProvider, Route, Outlet } from 'react-router-dom';
import './mainStyle.css';

/*Importing pages for routing*/
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Post from './pages/Post';
import Create from './pages/Create';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';

/*Layout utilising the react router outlet component to better organise pages*/
const Layout = () => {
  return(
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/Login",
        element:<Login/>
      },
      {
        path:"/Register",
        element:<Register/>
      },
      {
        path:"/post/:id",
        element:<Post/>
      },
      {
        path:"/Create",
        element:<Create/>
      },
    ]
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
