import Link from 'next/link';
import Image from 'next/image'
import React, { useState } from 'react';
function Navbar() {
    return (
        <nav className="left-0 right-0 top-0 flex justify-between items-center h-12">
            <div className="text-left mx-4 my-2 absolute top-0 left-0">
                <div className="flex flex-col items-center">
                <Link href="/">
                    <button className="text-gray-800 text-2xl px-4 py-1 rounded text-center">🚅 LiteLLM</button>
                </Link>
            </div>
            </div>
            <div className="text-right mx-4 my-2 absolute top-0 right-0">
            <a href="https://github.com/BerriAI/litellm" target="_blank" rel="noopener noreferrer">
                <button className="border-2 border-black rounded-lg flex items-center gap-4 px-4 py-2 mb-3 transition duration-300 ease-in-out hover:bg-gray-400">
                <Image
                    src="/octocat.svg"
                    alt="Github Icon"
                    width={20}
                    height={20}
                />Github</button>
            </a>
            </div>
        </nav>
    )
}

export default Navbar;