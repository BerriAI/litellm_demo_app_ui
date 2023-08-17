'use client'
import './globals.css'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Input, Button, Select } from 'antd';
import { useState, useRef, useEffect } from 'react';
const inter = Inter({ subsets: ['latin'] })
import Link from 'next/link';
import { AiOutlineCopy } from 'react-icons/ai';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Navbar from '../app/components/Navbar'
const Page = () => {
  const textRef = useRef();
  const [textToCopy, setTextToCopy] = useState("");
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [all_models, setAllModels] = useState('');
  const [prompt, setPrompt] = useState("Find me an API to translate from English to French.");
  const handleOnChange = (e) => setPrompt(e.target.value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.litellm.ai/get_model_list');
        const data = await response.json();
        setAllModels(data.model_list);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // get the text inside the <pre> tag
    let tempTextToCopy = textRef.current ? textRef.current.innerText : "";

    // add the pip install command at the start of the string
    let litePreReqs = "!pip install litellm\n" + "import os\n## set ENV variables\n" 
    litePreReqs += "os.environ['OPENAI_API_KEY'] = '' # For more - https://litellm.readthedocs.io/en/latest/supported/ \n"
    litePreReqs += "os.environ['ANTHROPIC_API_KEY'] = '' # For more - https://litellm.readthedocs.io/en/latest/supported/ \n"
    litePreReqs += "os.environ['HF_TOKEN'] = '' # For more - https://litellm.readthedocs.io/en/latest/supported/ \n"

    litePreReqs += "\n"

    tempTextToCopy = litePreReqs + tempTextToCopy;

    setTextToCopy(tempTextToCopy);
  }, [prompt]);

  const onClick = () => {
    console.log("value1: ", value1)
    console.log("value2: ", value2)
    console.log("value3: ", value3)
    try {
      // https://api.litellm.ai
      const apiUrl = 'https://api.litellm.ai/api_completion'; // Replace URL with your API endpoint
      const bodies = [
        { "model": value1, "prompt": prompt, "custom_llm_provider": "custom_openai", "custom_api_base": "http://zanino.millennium.berkeley.edu:8000/v1"}, // Replace with your JSON body
        { "model": value2, "prompt": prompt },
        { "model": value3, "prompt": prompt },
      ];
  
      bodies.forEach(body => {
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
          .then(response => response.json())
          .then(jsonResponse => {
            // Replace setValue with your appropriate method call
            const response = jsonResponse["choices"][0]["message"]["content"];
                      // Determine which model's response has been received and set the appropriate state variable
            switch (body.model) {
              case "gorilla-7b-hf-v1":
                setValue1(response);
                break;
              case "gpt-4":
                setValue2(response);
                break;
              case "claude-2":
                setValue3(response);
                break;
              default:
                console.error('Unexpected model:', body.model);
            }
          })
          .catch(error => console.error(error));
      });

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center m-10">
      {console.log("all model list: ", all_models)}
      <Navbar />
      <div className="fixed before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"/>
      <a href="https://github.com/BerriAI/litellm" target="_blank" rel="noopener noreferrer">
        <div className='flex flex-col items-center'>
        <h1 className="text-6xl mb-2"> LiteLLM </h1>
        <p className="mb-5 text-xl"> An open-source library to simplify LLM completion + embedding calls. </p>
        </div>
      </a>
      <a href="https://github.com/BerriAI/litellm" target="_blank" rel="noopener noreferrer">
      <button className="border-2 border-black rounded-lg flex items-center gap-4 px-5 py-3 mb-3 transition duration-300 ease-in-out hover:bg-gray-400">
        <Image
          src="/octocat.svg"
          alt="Github Icon"
          width={20}
          height={20}
        />
        Getting Started
      </button>
      </a>
      <a href='https://discord.com/invite/wuPM9dRgDw' target="_blank" rel="noopener noreferrer">
      <div className='mb-5'>
        <img src="https://img.shields.io/discord/1123360753068540065?color=212936" alt="Discord" />
      </div>
      </a>
      <div className="flex flex-col w-full h-[50vh] justify-center px-5 space-y-4">
      
  {/* First input box */}
  <p>This is a demo playground to compare different LLMs - all being called via LiteLLM (code below).</p>
  <div className="relative h-[40%] w-full">
  <textarea
      className="h-full w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base leading-tight resize-none"
      value={prompt}
      onChange={handleOnChange}  // this line was added
    />

    <button 
        type="submit"
        style={{"backgroundColor": "#212936"}}
        onClick={onClick}
        className="absolute bottom-0 right-0 m-3 px-4 py-1 bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white rounded">
        Submit
    </button> 
</div>

  {/* Group of input boxes */}
  <div className="flex h-full space-x-4">
  <div className="flex-1 h-full py-2">
    <Select
  showSearch
  className='mb-5'
  style={{ width: '25vw' }}
  placeholder="Select a model"
  optionFilterProp="children"
  onChange={setValue1}
  filterOption={(input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
>
{Array.isArray(all_models) && all_models.map((model, index) => (
    <Select.Option key={index} value={model}>{model}</Select.Option>
  ))}
</Select>
    <div className='h-full border border-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm overflow-y-auto' style={{width: '25vw', height: '30vh', overflow: 'auto'}}>
      {value1}
    </div>
  </div>
  <div className="flex-1 h-full py-2">
  <Select
  showSearch
  className='mb-5'
  style={{ width: '25vw' }}
  placeholder="Select a model"
  optionFilterProp="children"
  onChange={setValue2}
  filterOption={(input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
>
{Array.isArray(all_models) && all_models.map((model, index) => (
    <Select.Option key={index} value={model}>{model}</Select.Option>
  ))}
</Select>
      <div className='h-full border border-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm overflow-y-auto' style={{width: '25vw', height: '30vh', overflow: 'auto'}}>
        {value2}
      </div>
  </div>
  <div className="flex-1 h-full py-2">
  <Select
  showSearch
  className='mb-5'
  style={{ width: '25vw' }}
  placeholder="Select a model"
  optionFilterProp="children"
  onChange={setValue3}
  filterOption={(input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
>
{Array.isArray(all_models) && all_models.map((model, index) => (
    <Select.Option key={index} value={model}>{model}</Select.Option>
  ))}
</Select>
    <div className='h-full border border-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm overflow-y-auto' style={{width: '25vw', height: '30vh', overflow: 'auto'}}>
      {value3}
    </div>
  </div>
</div>
</div>
<div className='w-full px-3 py-2 mt-5'>
  <h1 className='text-2xl mt-5'>Implementation code</h1>
  <div className="bg-gray-800 relative rounded text-gray-200 flex justify-between items-start" style={{width: '90vw', overflow: 'auto'}}>
        <code className="flex-shrink-0 w-full">
        <pre className='p-3' ref={textRef}>
              {`from litellm import completion
models = ["gorilla-7b-hf-v1", "gpt-4", "claude-2"]
prompt = "${prompt}"
custom_llm_provider = None
custom_api_base = None
for model in models: 
  if model == "gorilla-7b-hf-v1":
      custom_llm_provider = "custom_openai"
      custom_api_base = "http://zanino.millennium.berkeley.edu:8000/v1"
  messages = [{ "content": prompt,"role": "user"}]
  try:
      response = completion(model=model, messages=messages, custom_llm_provider=llm_provider, custom_api_base=custom_api_base)
  except Exception as e:
      traceback.print_exc()
      response = {"error": str(e)}`}
              </pre>
            </code>
            <CopyToClipboard text={textToCopy}>
                <Button type="primary" icon={<AiOutlineCopy />} style={{ position: 'absolute', top: 0, right: 0 }}  />
            </CopyToClipboard>
      </div>
</div>
      </main>
    );
  };
  
  export default Page;