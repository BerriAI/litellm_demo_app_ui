import Link from 'next/link';
import React, { useState } from 'react';
function Navbar() {
    return (
        <nav className="left-0 right-0 top-0 flex justify-between items-center h-12">
            <div className="text-left mx-4 my-2 absolute top-0 left-0">
                <Link href="/">
                    <button className="text-xl text-gray-800">🚅 LiteLLM</button>
                </Link>
            </div>
            <div className="text-right mx-4 my-2 absolute top-0 right-0">
            <Link href="/playground">
                <button className="border border-gray-800 rounded-lg text-gray-800 text-xl px-4 py-1 rounded p-1 mr-2 text-center">
                    Playground
                </button>
            </Link>
                <a href="https://calendly.com/d/4mp-gd3-k5k/berriai-1-1-onboarding-litellm-hosted-version" target="_blank" rel="noopener noreferrer">
                    <button className="border border-gray-800 rounded-lg text-gray-800 text-xl px-4 py-1 rounded p-1 text-center">Call the Founders</button>
                </a>
            </div>
        </nav>
    )
}

export default Navbar;