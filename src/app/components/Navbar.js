import Link from 'next/link';


function Navbar() {
    return (
      <nav className="left-0 right-0 top-0 flex justify-between items-center h-12">
        <div className="border border-gray-800 rounded-lg text-right mx-4 my-2 absolute top-0 right-0">
          <a href="https://calendly.com/d/4mp-gd3-k5k/berriai-1-1-onboarding-litellm-hosted-version" target="_blank" rel="noopener noreferrer">
            <button className="text-gray-800 text-xl px-4 py-1 rounded p-1 text-center">Call the Founders</button>
          </a>
        </div>
      </nav>
    );
  }
export default Navbar;