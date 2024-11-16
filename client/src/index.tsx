import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Calendar from './components/Calendar/Calendar';
import Profile from './components/Profile/Profile';
//import reportWebVitals from './reportWebVitals';

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
    <Route path="/profile" element={<Profile/>}/>
    <Route path="/calendar" element={<Calendar/>}/>
    <Route path="/editor" element={<div>Not implemented.</div>}/>
    <Route path="/search" element={<div>Not implemented.</div>}/>
    <Route path="/login" element={<div>Not implemented.</div>}/>
  </Route>,
  <Route path="/*" element={<div>404 not found.</div>}/>
]));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//Web vitals is broken idk
//reportWebVitals();
