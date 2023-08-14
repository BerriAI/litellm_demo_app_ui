'use client'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react';
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
  const [api_result_status, setApiResultStatus] = useState('API Response')
  const [api_result, setApiResult] = useState({'choices': [{'finish_reason': 'stop',
  'index': 0,
  'message': {'role': 'assistant',
   'content': " I'm doing well, thank you for asking. I am Claude, an AI assistant created by Anthropic."}}],
'created': 1691429984.3852863,
'model': 'claude-instant-1',
'usage': {'prompt_tokens': 18, 'completion_tokens': 23, 'total_tokens': 41}});
  const [textToCopy, setTextToCopy] = useState("");
  const textRef = useRef();
  useEffect(() => {
    // get the text inside the <pre> tag
    let tempTextToCopy = textRef.current ? textRef.current.innerText : "";

    // add the pip install command at the start of the string
    let litePreReqs = "!pip install litellm\n" + "import os\n## set ENV variables\n" 
    console.log('azure_value: ', azure_value)
    if (azure_value == true) {
      litePreReqs += "os.environ['AZURE_API_KEY'] = '' \n"
      litePreReqs += "os.environ['AZURE_API_BASE'] = ''\n"
      litePreReqs += "os.environ['AZURE_API_VERSION'] = '' # For more - https://litellm.readthedocs.io/en/latest/supported/ \n"
    } else if (model == "gpt-3.5-turbo" || model == "gpt-4") {
      litePreReqs += "os.environ['OPENAI_API_KEY'] = '' # For more - https://litellm.readthedocs.io/en/latest/supported/ \n"
    } else if (model == "claude-instant-1" || model == "claude-2") {
      litePreReqs += "os.environ['ANTHROPIC_API_KEY'] = '' # For more - https://litellm.readthedocs.io/en/latest/supported/ \n"
    } else if (model == "command-nightly") {
      litePreReqs += "os.environ['COHERE_API_KEY'] = '' # For more - https://litellm.readthedocs.io/en/latest/supported/ \n"
    } else if (model.includes("replicate")) {
      litePreReqs += "os.environ['REPLICATE_API_KEY'] = '' # For more - https://litellm.readthedocs.io/en/latest/supported/ \n"
    }

    litePreReqs += "\n"

    tempTextToCopy = litePreReqs + tempTextToCopy;

    setTextToCopy(tempTextToCopy);
  }, [model, prompt, azure_value]);


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
    let data = {}
    if (azure_value == true) {
      data = {
        "model": model,
        "prompt": prompt,
        "azure": azure_value,
        "deployment_id": "chatgpt-test"
      }
    } else {
      data = {
        "model": model,
        "prompt": prompt,
        "azure": azure_value
      }
    }
    setApiResultStatus('⏳ New response is loading ...')
    fetch('https://api.litellm.ai/api_completion', {
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
        setApiResultStatus('👇New API Response')
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
      <a href="https://github.com/BerriAI/litellm" target="_blank" rel="noopener noreferrer">
        <div className='flex flex-col items-center'>
        <h1 className="text-6xl mb-2"> LiteLLM </h1>
        <p className="mb-8 text-xl"> An open-source library to simplify LLM completion + embedding calls. </p>
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

      <div className="space-y-5">
        <h3 className="text-base">Call Azure, Anthropic, OpenAI, Cohere and Replicate with just 1 function.</h3>
        <div>
        <div className="bg-gray-800 relative rounded text-gray-200 flex justify-between items-start" style={{width: '80vw', overflow: 'auto'}}>
        <code className="flex-shrink-0">
        <pre className='p-3' ref={textRef}>
              {`from litellm import completion
messages = [{ "content": "${prompt}","role": "user"}]
azure = ${azure_value}
response = completion(model="${model}", messages=messages${deployment_id ? `, deployment_id="${deployment_id}"` : ""}, azure=azure)`}<span className="text-gray-400"> # just like the openai chatCompletion call</span>
              </pre>
            </code>
            <CopyToClipboard text={textToCopy}>
                <Button type="primary" icon={<AiOutlineCopy />} style={{ position: 'absolute', top: 0, right: 0 }}  />
            </CopyToClipboard>
      </div>
        <Select defaultValue="gpt-3.5-turbo" className="w-full mt-1" onChange={handleModelChange} size="large">
          <Option value="gpt-3.5-turbo">gpt-3.5-turbo</Option>
          <Option value="gpt-4">gpt-4</Option>
          <Option value="claude-instant-1">claude-instant-1</Option>
          <Option value="claude-instant-1">claude-2</Option>
          <Option value="azure-openai">azure-openai</Option>
          <Option value="command-nightly">command-nightly [Cohere's API]</Option>
          <Option value="replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1">replicate/llama-2.. [Replicate's API]</Option>
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
        <h3 className="text-xl">{api_result_status}<span className='text-gray-800 text-base'> (Consistent output format with token usage)</span></h3>
        <div className="bg-gray-200 p-4 rounded" style={{width: '80vw', overflow: 'auto'}}>
          <code>
          <pre style={{whiteSpace: "pre-wrap"}} dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(api_result) }}></pre>
          </code>
        </div>
        </div>
      </div>
      <a href="https://github.com/BerriAI/litellm" target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col items-center" style={{width: '80vw'}}>
        <p className="my-4 text-xl">Built with ❤️ using 🚅 LiteLLM</p>
        <p className="my-4 text-xl">Text/iMessage/Whatsapp us @ +17708783106</p>
      </div>
      </a>
    </main>
  )
}
