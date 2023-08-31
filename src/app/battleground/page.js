'use client'
import Image from 'next/image'
import { useState, useRef, useEffect, use } from 'react';
import { CopyBlock, solarizedLight } from "react-code-blocks";
import { Input, Select } from 'antd';
const { Option } = Select;
import Navbar from '../components/BattlegroundNavbar';
import { InformationCircleIcon, ClipboardIcon } from "@heroicons/react/outline";
import { Button, TextInput, Grid, Col, Card, Title, Text } from "@tremor/react";
import { ThumbUpIcon, ThumbDownIcon } from "@heroicons/react/solid";
import { Icon } from "@tremor/react";

import { message } from 'antd';
import mixpanel from 'mixpanel-browser';
import {
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
  Flex
} from "@tremor/react";
export default function App() {
  mixpanel.init("69c4620538e80373ae4ef8edb32ce5e3", { debug: true, track_pageview: true, persistence: 'localStorage' });
  const [prompt, setPrompt] = useState("Write a python function that prints hello world");
  const [model1, setModel1] = useState('huggingface/https://ji16r2iys9a8rjk2.us-east-1.aws.endpoints.huggingface.cloud');
  const [model2, setModel2] = useState('huggingface/https://tewodf1mzmqbo7yy.us-east-1.aws.endpoints.huggingface.cloud');
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const handleOnChange = (e) => setPrompt(e.target.value);
  const textRef = useRef();
  const handleModelNameCopy = async () => {
    message.success('Model name copied...');
    try {
      await navigator.clipboard.writeText("together_ai/togethercomputer/CodeLlama-34b-Instruct");
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  }
  useEffect(() => {
    document.body.style.backgroundColor = "white"

    return () => {
        document.body.style.backgroundColor = null // reset to default style
    }
}, []);

const onClick = async () => {
  try {
    try {
      mixpanel.track('litellm.model_page.submit_btn_clicked', {})
    } catch (error) {
      console.error(error);
    }
    //https://api.litellm.ai
    const apiUrl = 'https://api.litellm.ai/chat/completions'; // Replace URL with your API endpoint
    const bodies = [
      { "model": "huggingface/https://ji16r2iys9a8rjk2.us-east-1.aws.endpoints.huggingface.cloud", "messages": [{"role": "user", "content": prompt}], "max_tokens": 128, "stream": true },
      { "model": "huggingface/https://tewodf1mzmqbo7yy.us-east-1.aws.endpoints.huggingface.cloud", "messages": [{"role": "user", "content": prompt}], "max_tokens": 128, "stream": true }
    ] // Replace with your JSON body

    bodies.forEach(async (body) => {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-playground-02738593-a46e-4b39-99a9-5bb1c6bd6950',
        },
        body: JSON.stringify(body)
      })
  
      if (!response.ok) throw new Error('API request failed');
      const contentType = response.headers.get("content-type");
      try {
        mixpanel.track('litellm.model_page.model_call_succeeded', {})
      } catch (error) {
        console.error(error);
      }
      if (contentType && contentType.includes("text/event-stream")) {
        const response_body = response.body;
        const reader = response_body.getReader();
        const decoder = new TextDecoder();
        let done = false;
  
        while (!done) {
          const { value, done: readingDone } = await reader.read();
          done = readingDone;
  
          let chunkValue = decoder.decode(value);
          // Check if chunkValue starts with "data: " and remove it
          if (chunkValue.startsWith('data: ')) {
            chunkValue = chunkValue.slice(6);
          }
          // Split by new lines
          const lines = chunkValue.split('\n');
  
          // Check & Parse each line 
          lines.forEach(line => {
            if (line.startsWith('data: ')) {
              line = line.slice(6); // remove "data: " 
            }
  
            if(line.trim() === "") return; // skip empty lines
  
            try {
              const data = JSON.parse(line);
              const content = data.choices[0].delta.content;
              if (content) {
                if (body.model === model1) {
                  setValue1((prev) => prev + content);
                }
                else if (body.model === model2) {
                  setValue2((prev) => prev + content);
                }
              }
            } 
            catch (error) {
              console.error("Error parsing JSON:", error);
            }
          });
        }
      } else {
        throw new Error('API request failed');
      }
    })
  } catch (error) {
    try {
      mixpanel.track('litellm.model_page.model_call_failed', {})
    } catch (error) {
      console.error(error);
    }
    console.error(error);
  }
}

  return (
    <main className="flex min-h-screen flex-col items-center m-10">
      <Navbar />
      <div className="fixed before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"/>
      <a href="https://github.com/BerriAI/litellm" target="_blank" rel="noopener noreferrer">
        <div className='flex flex-col items-center'>
        <Image
          src="clash.svg"
          alt="Github Icon"
          width={500}
          height={500}
        />
        </div>
      </a>
      <div className='flex mt-10 w-full relative'>
        <TextInput placeholder="Write a python function that prints hello world" onChange={handleOnChange} className='h-[7rem]'/>
        <Button variant='primary' onClick={onClick} className="absolute bottom-0 right-0 m-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white rounded">
        Submit
        </Button>
</div>
    <Grid numItems={2} className="gap-2 w-full justify-between">
    <Col className="flex flex-col items-center h-[20rem]">
      <div className='flex mt-10'>
      <p 
          className="text-l rounded p-3 text-center flex items-center justify-center"
          style={{backgroundColor: "#FDF6E3"}}
        >
        <span className="text-gray-400">WizardLM/</span>
        WizardCoder-Python-34B-V1.0
      </p>
      <Button icon={ClipboardIcon} variant='light' className="text-gray-500 cursor-pointer m-5" onClick={handleModelNameCopy}/>
      </div>
      <div className='relative mt-2 w-full h-full max-w-lg overflow-auto border-2 border-gray-200 rounded-lg'>
        <Text className='p-5'>
          <b>Model Output:</b> {value1}
        </Text>
      </div>
      </Col>
      <Col className="flex flex-col items-center h-[20rem]">
      <div className='flex mt-10'>
      <p 
          className="text-l rounded p-3 text-center flex items-center justify-center"
          style={{backgroundColor: "#FDF6E3"}}
        >
        <span className="text-gray-400">Phind/</span>
        Phind-CodeLlama-34B-v2
      </p>
      <Button icon={ClipboardIcon} variant='light' className="text-gray-500 cursor-pointer m-5" onClick={handleModelNameCopy}/>
      </div>
      <div className='relative mt-2 w-full h-full max-w-lg overflow-auto border-2 border-gray-200 rounded-lg'>
        <Text className='p-5'>
          <b>Model Output:</b> {value2}
        </Text>
      </div>
      </Col>
      </Grid>
      <div className='w-full flex flex-col mt-10'>
      <Card>
      <Text className='text-xl'>Implementation Code</Text>
      <TabGroup>
        <TabList className="mt-8">
          <Tab>Huggingface</Tab>
          <Tab>Baseten</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="flex flex-col">
            <a href='https://docs.litellm.ai/docs/providers/huggingface' target="_blank" rel="noopener noreferrer"><p className='mt-5 mb-5 text-indigo-800'>Go here for deployment instructions</p></a>
                <CopyBlock text={`!pip install litellm
from litellm import completion

## set ENV variables
os.environ["HUGGINGFACE_API_KEY"] = "your_api_key"

messages = [{ "content": "Write a python function that prints hello world","role": "user"}]

# huggingface call
response = completion(model="huggingface/<your_model_url>", messages=messages)

`} customStyle={{ padding: "3%" }} language={"python"} theme={solarizedLight} showLineNumbers={false}/>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="flex flex-col">
            <a href='https://truss.baseten.co/examples/performance/tgi-server' target="_blank" rel="noopener noreferrer"><p className='mt-5 mb-5 text-indigo-800'>Go here for deployment instructions</p></a>
                <CopyBlock text={`!pip install litellm
from litellm import completion

## set ENV variables
os.environ["BASETEN_API_KEY"] = ""

messages = [{ "content": "Write a python function that prints hello world","role": "user"}]

# baseten call
response = completion(model="baseten/<your_model_id>", messages=messages)

`} customStyle={{ padding: "3%" }} language={"python"} theme={solarizedLight} showLineNumbers={false}/>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
        
      </div>
      <p className='text-md mt-10'>Made with ❤️ from San Francisco</p>
    </main>
  )
}
