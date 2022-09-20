import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Listing from './containers/Listing'
import Home from './containers/Home'

export default function App(props) {
  return (
    <div className="dark:bg-neutral-900 bg-neutral-50 subpixel-antialiased">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="listing" element={<Listing />} />
      </Routes>
    </div>
  );
};
