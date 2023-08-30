'use client'
import Image from 'next/image'
import { useState, useRef, useEffect, use } from 'react';
import { CopyBlock, solarizedLight } from "react-code-blocks";
import { Input, Select } from 'antd';
const { Option } = Select;
import Navbar from '../../components/Navbar';
import { InformationCircleIcon, ClipboardIcon } from "@heroicons/react/outline";
import { Button, TextInput, Grid, Col, Card, Title, Text } from "@tremor/react";
import { message } from 'antd';
import mixpanel from 'mixpanel-browser';

export default function App() {
  mixpanel.init("69c4620538e80373ae4ef8edb32ce5e3", { debug: true, track_pageview: true, persistence: 'localStorage' });
  const [prompt, setPrompt] = useState("Write a python function that prints hello world");
  const [value, setValue] = useState("");
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
    const apiUrl = 'https://api.litellm.ai/chat/completions'; // Replace URL with your API endpoint
    const body = { "model": "together_ai/togethercomputer/CodeLlama-34b-Instruct", "messages": [{"role": "user", "content": prompt}], "stream": true } // Replace with your JSON body

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
            console.log("model:", body.model);
            console.log("content:", content);
            if (content) { setValue((prev) => prev + content) } 
          } 
          catch (error) {
            console.error("Error parsing JSON:", error);
          }
        });
      }
    } else {
      throw new Error('API request failed');
    }


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
        <h1 className="text-6xl mb-2"> CodeLlama </h1>
        </div>
      </a>
      <div className='flex mt-10'>
      <p className="text-xl m-5">Model Name:</p>
      <p 
          className="text-l rounded p-3 text-center flex items-center justify-center"
          style={{backgroundColor: "#FDF6E3"}}
        >
        <span className="text-gray-400">together_ai</span>
        /togethercomputer/CodeLlama-34b-Instruct 
      </p>
      <Button icon={ClipboardIcon} variant='light' className="text-gray-500 cursor-pointer m-5" onClick={handleModelNameCopy}/>
      </div>
      <div className='flex mt-10'>
      <Grid numItems={6} className='gap-2'>
      <Col numColSpan={4}>
      <Card className='h-full max-w-lg overflow-auto'>
        <Title className='p-1 text-center'>Playground</Title>
      <Grid numItems={6} className='gap-2'>
        <Col numColSpan={5}>
        <TextInput placeholder="Write a python function that prints hello world" />
        </Col>
        <Button size="md" onClick={onClick}>Submit</Button>
      </Grid>
      <Text className='mt-2 max-h-24 overflow-auto'><b>Model Output:</b> {value}</Text>
      </Card>
      </Col>
      <Col numColSpan={2}>
      <Card>
        <Title className='p-1 text-center'>Model Details</Title>
        <p className="text-l m-5">Provider Name: Together AI</p>
        <p className="text-l m-5">Context Window: 16k tokens</p>
        <p className="text-l m-5">Cost: $0.003 / 1k tokens</p>
        </Card>
        </Col>
      </Grid>
      </div>
      <div className='flex flex-col items-center justify-center mt-10'>
        <p className="text-xl m-5">Usage</p>
        <CopyBlock text={`!pip install litellm
from litellm import completion

## set ENV variables
os.environ["TOGETHERAI_API_KEY"] = ""

messages = [{ "content": "Write a python function that prints hello world","role": "user"}]

# together ai call
response = completion(model="together_ai/togethercomputer/CodeLlama-34b-Instruct", messages=messages)

`} customStyle={{ padding: "3%" }} language={"python"} theme={solarizedLight} showLineNumbers={false}/>
      </div>
      <p className='text-md mt-10'>Made with ❤️ from San Francisco</p>
    </main>
  )
}
