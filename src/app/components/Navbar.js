import Link from 'next/link';
import React, { useState } from 'react';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    }
    return (
        <nav className="left-0 right-0 top-0 flex justify-between items-center h-12">
            <a href="https://calendly.com/d/4mp-gd3-k5k/berriai-1-1-onboarding-litellm-hosted-version" target="_blank" rel="noopener noreferrer">
            <div className="border border-gray-800 rounded-lg text-right mx-4 my-2 absolute top-0 right-0">
                <button className="text-gray-800 text-xl px-4 py-1 rounded p-1 text-center" onClick={toggleModal}>Call the Founders</button>
            </div>
            </a>
        </nav>
    )
}

export default Navbar;