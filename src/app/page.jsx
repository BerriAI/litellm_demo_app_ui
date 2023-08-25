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
import Playground from "../pages/playground"

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
  mixpanel.init("69c4620538e80373ae4ef8edb32ce5e3", { debug: true, track_pageview: true, persistence: 'localStorage' });

  useEffect(() => {
    try {
      mixpanel.track('litellm.landing_page.page_loaded', {})
    } catch (error) {
      console.error(error);
    }
  }, [])

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
    setModel(value);
  }

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  }

  const handleSubmit = async () => {
    console.log("submit");
    try {
      mixpanel.track('litellm.landing_page.submit_btn_clicked', {})
    } catch (error) {
      console.error(error);
    }
    let data = {}
    if (azure_value == true) {
      data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "custom_llm_provider": "azure",
        "deployment_id": "chatgpt-test"
      }
    } else {
      data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": true
      }
    }
    setApiResultStatus('⏳ New response is loading ...')
    try {
      const response = await fetch('https://api.litellm.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-landing_page-6a3130ee-83c5-4ee2-9c71-2e9c03096a360',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('API request failed');
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = response.json();
        console.log(result);
        setApiResult(result);
        setApiResultStatus('👇New API Response');
      } else if (contentType && contentType.includes("text/event-stream")) {
        setApiResult("");
        const body = response.body;
        const reader = body.getReader();
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
              console.log("Content:", content);
              if (content) {
                setApiResult((prev) => prev + content);
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
    } catch (error) {
      // handle network or other errors
      console.error(error);
    }
  }
  
  return (
    <Playground/>
  )
}
