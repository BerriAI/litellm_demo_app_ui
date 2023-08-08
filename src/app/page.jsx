'use client'
import Image from 'next/image'
import { useState } from 'react';
import { Input, Button, Select } from 'antd';
const { Option } = Select;
import { prettyPrintJson } from 'pretty-print-json';
import { AiOutlineCopy } from 'react-icons/ai';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Navbar from './components/Navbar';
export default function App() {
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [prompt, setPrompt] = useState("Hey, how's it going?");
  const [azure_value, setAzureValue] = useState(false);
  const [deployment_id, setDeploymentID] = useState(null);
  const [api_result, setApiResult] = useState({'choices': [{'finish_reason': 'stop',
  'index': 0,
  'message': {'role': 'assistant',
   'content': " I'm doing well, thank you for asking. I am Claude, an AI assistant created by Anthropic."}}],
'created': 1691429984.3852863,
'model': 'claude-instant-1',
'usage': {'prompt_tokens': 18, 'completion_tokens': 23, 'total_tokens': 41}});

  const handleModelChange = (value) => {
    if (value == "azure-openai") {
      setAzureValue(true)
      setModel("gpt-3.5-turbo");
      setDeploymentID(value)
    } else {
      setModel(value);
      setAzureValue(false)
      setDeploymentID(null)
    }
  }

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  }

  const handleSubmit = () => {
    console.log("submit")
    // handle submit logic here
    let data = {
      "model": model,
      "prompt": prompt,
      "azure": azure_value
    }

    fetch('https://litellm-demo-app-7tn2.zeet-berri.zeet.app/api_completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        // handle the response data here
        setApiResult(result)
        console.log(result);
      })
      .catch(error => {
        // handle errors here
        console.error(error);
      });
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Navbar />
      <div className="fixed before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"/>
      <h1 className="text-6xl mb-2"> LiteLLM </h1>
      <p className="mb-8 text-xl"> An open-source library to simplify LLM completion + embedding calls. </p>

      <a href="https://github.com/BerriAI/litellm" target="_blank" rel="noopener noreferrer">
      <button className="border-2 border-black rounded-lg flex items-center gap-4 px-5 py-3 mb-10">
        <Image
          src="/octocat.svg"
          alt="Github Icon"
          width={20}
          height={20}
        />
        Getting Started
      </button>
      </a>
      
      <div className="space-y-5">
        <h3 className="text-base">Call Azure, Anthropic, OpenAI, Cohere and Replicate with just 1 function.</h3>
        <div>
        <div className="bg-gray-800 rounded text-gray-200 flex justify-between items-start" style={{width: '80vw', overflow: 'auto'}}>
        <code className="flex-shrink-0">
        <pre className='p-3'>
              {`from litellm import completion
messages = [{ "content": "${prompt}","role": "user"}]
azure = ${azure_value}
response = completion(model="${model}", messages=messages${deployment_id ? `, deployment_id="${deployment_id}"` : ""}, azure=azure)`}<span className="text-gray-400"> # just like the openai chatCompletion call</span>
              </pre>
            </code>
            <CopyToClipboard text={"hello world"}>
                <Button type="primary" icon={<AiOutlineCopy />} style={{ marginLeft: 'auto' }} />
            </CopyToClipboard>
      </div>
        <Select defaultValue="gpt-3.5-turbo" className="w-full mt-1" onChange={handleModelChange} size="large">
          <Option value="gpt-3.5-turbo">gpt-3.5-turbo</Option>
          <Option value="claude-instant-1">claude-instant-1</Option>
          <Option value="azure-openai">azure-openai</Option>
        </Select>
        </div>

        <div className="flex items-center space-x-4">
        <Input
          placeholder={prompt}
          onChange={handlePromptChange} size="large"/>
          <Button type="primary" onClick={handleSubmit} className='bg-gray-800 text-white' size="large">
            Submit
          </Button>
        </div>
        <div>
        <h3 className="text-xl">API Response<span className='text-gray-800'> (👀 Lite ensures consistent input/output formats)</span></h3>
        <div className="bg-gray-200 p-4 rounded">
          <code>
          <pre style={{whiteSpace: "pre-wrap"}} dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(api_result) }}></pre>
          </code>
        </div>
        </div>
      </div>
      
      <p className="mt-8"> Built with ❤️ from San Francisco. Backed by Y Combinator.</p>
      <p className="mt-8"> Text/Whatsapp us @ +17708783106</p>
    </main>
  )
}
