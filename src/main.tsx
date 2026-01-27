import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';

const Page1= lazy(() =>
  wait(1300).then(() => import("./screens/page1.tsx"))
);

const Page2= lazy(() =>
  wait(1300).then(() => import("./screens/page2.tsx"))
);

const ItemDetail= lazy(() =>
  wait(1000).then(() => import("./screens/itemDetail.tsx"))
);

const InventoryView= lazy(() =>
  wait(1000).then(() => import("./screens/inventoryView.tsx"))
);

const PrivacyPolicy= lazy(() =>
  wait(1000).then(() => import("./screens/privacyPolicy.tsx"))
);

const TermsOfService= lazy(() =>
  wait(1000).then(() => import("./screens/termsOfService.tsx"))
);

const HomePage= lazy(() =>
  wait(1000).then(() => import("./screens/homePage.tsx"))
);

const router = createBrowserRouter([
  {
    path: "/inventory/",
    element: <App />,
    
    children: [
      {
        path: "/inventory/", 
        element: <Navigate to="/inventory/home" />, 
      },
      {
        path: "/inventory/home",
        element: <>
        <Suspense fallback={<Loader />}>
          <HomePage />
        </Suspense>
      </>,
      },
      {
        path: "/inventory/page1",
        element: <>
        <Suspense fallback={<Loader />}>
          <Page1 />
        </Suspense>
      </>,
      },
      {
        path: "/inventory/page2",
        element: <>
        <Suspense fallback={<Loader />}>
          <Page2 />
        </Suspense>
      </>,
      },
      {
        path: "/inventory/view",
        element: <>
        <Suspense fallback={<Loader />}>
          <InventoryView />
        </Suspense>
      </>,
      },
      {
        path: "/inventory/item/:itemName",
        element: <>
        <Suspense fallback={<Loader />}>
          <ItemDetail />
        </Suspense>
      </>,
      },
      {
        path: "/inventory/privacy-policy",
        element: <>
        <Suspense fallback={<Loader />}>
          <PrivacyPolicy />
        </Suspense>
      </>,
      },
      {
        path: "/inventory/terms-of-service",
        element: <>
        <Suspense fallback={<Loader />}>
          <TermsOfService />
        </Suspense>
      </>,
      },



      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function wait( time:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
