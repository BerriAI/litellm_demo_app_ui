'use client'
import Image from 'next/image'
import { useState, useRef, useEffect, use } from 'react';
import { Input, Button, Select } from 'antd';
const { Option } = Select;
import { prettyPrintJson } from 'pretty-print-json';
import { AiOutlineCopy } from 'react-icons/ai';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Navbar from './components/Navbar';
import mixpanel from 'mixpanel-browser';
import Playground from "../pages/playground";
import Chat from "./components/Chat";
import { CopyBlock, solarizedDark } from "react-code-blocks";
import {
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
  Flex
} from "@tremor/react";

export default function App() {
 
  return (
    <main className="flex min-h-screen flex-col items-center m-10">
      <Navbar />
      <div className="fixed before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"/>
      <a href="https://github.com/BerriAI/litellm" target="_blank" rel="noopener noreferrer">
        <div className='flex flex-col items-center'>
        <h1 className="text-6xl mb-2"> LiteLLM </h1>
        <p className="mb-5 text-xl"> An open-source library to simplify LLM completion + embedding calls. </p>
        </div>
      </a>
      <a href={"https://docs.litellm.ai/docs/tutorials/first_playground"} target="_blank" rel="noopener noreferrer">
      <button className="border-2 border-black rounded-lg flex items-center gap-4 px-5 py-3 mb-3 transition duration-300 ease-in-out hover:bg-gray-400">
        <Image
          src="/octocat.svg"
          alt="Github Icon"
          width={20}
          height={20}
        />
        Create your own Playground
      </button>
      </a>
      <a href='https://discord.com/invite/wuPM9dRgDw' target="_blank" rel="noopener noreferrer">
      <div className='mb-5'>
        <img src="https://img.shields.io/discord/1123360753068540065?color=212936" alt="Discord" />
      </div>
      </a>
    <TabGroup>
    <TabList className='w-full flex items-center justify-center'>
        <Tab>Implementation Code</Tab>
        {/* <Tab>Playground</Tab> */}
      </TabList>
        <TabPanels>
        <TabPanel>
            <div className="flex flex-col">
            {/* <Chat/> */}
            <CopyBlock text={`!pip install litellm
from litellm import completion
import os
## set ENV variables
os.environ["OPENAI_API_KEY"] = "openai key"
os.environ["COHERE_API_KEY"] = "cohere key"

messages = [{ "content": "Hello, how are you?","role": "user"}]

# openai call
response = completion(model="gpt-3.5-turbo", messages=messages)

# cohere call
response = completion("command-nightly", messages)
`} customStyle={{ padding: "3%" }} language={"python"} theme={solarizedDark} showLineNumbers={false}/>
            </div>
          </TabPanel>
          {/* <TabPanel>
            <div className="flex flex-col">
            <Playground/>
            </div>
          </TabPanel> */}
          </TabPanels>
          
      </TabGroup>
      </main>
  )
}
