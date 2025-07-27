import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Unauthorized from '@pages/Unauthorized';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import UserProfile from './pages/Perfil';
import { AuthProvider } from './context/AuthContext';
import CalendarioEventos from '@components/Eventos/Calendario.jsx';
import Votaciones from '@pages/Votaciones.jsx';
import Eventos from './pages/Eventos';
import Reuniones from './pages/Reuniones';
import ReunionDetalle from './pages/ReunionesDetalle';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/users',
        element: (

          <ProtectedRoute allowedRoles={['Administrador','Presidente', 'Secretario','Tesorero']}>
            <Users />
          </ProtectedRoute>
        )
      },
      {
        path: '/eventos',

        element:
          <ProtectedRoute allowedRoles={['Administrador','Presidente', 'Secretario','Tesorero', 'Vecino']}>
            <Eventos />
          </ProtectedRoute>

      },
      {
        path: '/reuniones',
        element:
        <ProtectedRoute allowedRoles={['Administrador','Presidente', 'Secretario','Tesorero','Vecino']}>
          <Reuniones />
        </ProtectedRoute>

      },
      
      {
        path: '/reunion/:id',
        element: 
        <ProtectedRoute allowedRoles={['Administrador','Presidente', 'Secretario','Tesorero','Vecino']}>
          <ReunionDetalle />
        </ProtectedRoute>
      },
      {
        path: '/perfil',
        element: ( 
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
                )

      },
      {
        path: '/home',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
  )
      },
      {
        path: '/votaciones',
        element: <Votaciones />
      },
    ]
  },
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/unauthorized', 
    element: <Unauthorized />
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);