import { StrictMode, createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import { Authorize, auth } from './services/auth';
import { onAuthStateChanged, UserInfo } from 'firebase/auth';
import Login from './components/Login/Login';
import SearchUsers from './components/SearchReults/SearchUsers';
import SearchDiets from './components/SearchReults/SearchDiets';

//import reportWebVitals from './reportWebVitals';

export const AuthContext = createContext<AuthContextDetails>({user: null, loading: true});

export interface AuthContextDetails {
  user: UserInfo | null;
  loading: boolean;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App/>
  </StrictMode>
);

// Define the client side pages for the app
// This defines the following pages and their urls:
// -> /home, /profile, /editor, /search, /login
// /home contains the home feed. Currently no nested routes planned
// /profile contains the user's profile and current diet calendar
// /editor contains the diet calendar editor
// /search contains the searching and query page for searching users/calendars
// /login handles signing in and/or signing up
const router = createBrowserRouter(createRoutesFromElements([
  <Route path="/" element={<NavBar/>}>
    <Route index element={<Navigate to="/home" replace={true}/>}/>
    <Route path="/home" element={<Home/>}/>
    <Route path="/profile" element={<Authorize component={<Profile/>}/>}/>
    <Route path="/editor" element={<div>Not implemented.</div>}/>
    <Route path="/searchUsers/:query" element={<SearchUsers/>}/>
    <Route path="/searchDiets/:query" element={<SearchDiets/>}/>
    <Route path="/profile/:id" element={<Profile/>}/>
    <Route path="/login" element={<Login/>}/>
  </Route>,
  <Route path="/*" element={<div>404 not found.</div>}/>
]));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//Web vitals is broken idk
//reportWebVitals();

function App() {
  const [user, setUser] = useState<AuthContextDetails>({user: null, loading: true});
  useEffect(() => {
    console.log("Attaching listener to auth.");
    const unsubscribe = onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        console.log("User changed:", userInfo);
        setUser({user: userInfo, loading: false});
      } else {
        setUser({user: null, loading: false});
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={user}>
      <RouterProvider router={router}/>
    </AuthContext.Provider>
  );
}