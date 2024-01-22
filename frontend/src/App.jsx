import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider, NavLink } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import SpotDetailPage from './components/SpotDetailPage/SpotDetailPage';
import * as sessionActions from './store/session';
import './index.css';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <header>
        <NavLink to="/">
          <img src="/favicon.ico" alt="Logo" className="logo" />
        </NavLink>
        <Navigation isLoaded={isLoaded} />
      </header>
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        path: '/',
        element: < LandingPage />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetailPage />
      }

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
