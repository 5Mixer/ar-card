import React from 'react';
import { Link } from 'react-router-dom';

export default function Home(props) {
  return (
    <div className="dark:bg-neutral-900 bg-neutral-50 subpixel-antialiased container">
        <section className="shrink w-full p-8 rounded h-screen overflow-auto">
            <h1 className="text-5xl text-gray-900 dark:text-white block mb-10">Augmented Reality Portal</h1>
            
            <p>
                <Link to="listing" className="text-gray-900 font-bold dark:hover:text-amber-400 hover:text-amber-900">Open</Link>
            </p>
        </section>
    </div>
  );
};
