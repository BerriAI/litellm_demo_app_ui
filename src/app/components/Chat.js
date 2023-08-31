import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import styles from '../Home.module.css'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {

  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      "message": "Hi there! How can I help?",
      "type": "apiMessage"
    }
  ]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [...prevMessages, { "message": "Oops! There seems to be an error. Please try again.", "type": "apiMessage" }]);
    setLoading(false);
    setUserInput("");
  }

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { "message": userInput, "type": "userMessage" }]);

    // Send user question and history to API
    const response = await fetch("https://shiny-iceberg-pqzc.zeet-berri.zeet.app/query", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ "query": userInput, "stream": true }),
    });

    if (!response.ok) {
      handleError();
      return;
    }
    const contentType = response.headers.get("content-type");

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
              console.log("data: ", data)
              const content = data.choices[0].delta.content;
              console.log("content:", content);
              if (content && content.length > 0) { 
                setMessages((prevMessages) => {
                  // Check if previous message is also an apiMessage
                  if(prevMessages.length > 0 && prevMessages[prevMessages.length - 1].type === "apiMessage") {
                    // Append content to last message
                    const updatedMessages = [...prevMessages];
                    updatedMessages[updatedMessages.length - 1].message += content;
                    return updatedMessages;
                  } else {
                    // Add new apiMessage
                    return [...prevMessages, { "message": content, "type": "apiMessage" }]
                  }
                })
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
    

    if (data.error === "Unauthorized") {
      handleError();
      return;
    }

    setMessages((prevMessages) => [...prevMessages, { "message": data.response, "type": "apiMessage" }]);
    setLoading(false);
    
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if(!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Keep history in sync with messages
  useEffect(() => {
    if (messages.length >= 3) {
      setHistory([[messages[messages.length - 2].message, messages[messages.length - 1].message]]);
    }
    }, [messages])

  return (
    <>
      <main className={styles.main}>
      <div className = {styles.cloud}>
        <div ref={messageListRef} className = {styles.messagelist}>
        {messages.map((message, index) => {
          return (
            // The latest message sent by the user will be animated while waiting for a response
              <div key = {index} className = {message.type === "userMessage" && loading && index === messages.length - 1  ? styles.usermessagewaiting : message.type === "apiMessage" ? styles.apimessage : styles.usermessage}>
                {/* Display the correct icon depending on the message type */}
                {message.type === "apiMessage" ? <Image src = "litellmicon.svg" alt = "AI" width = "30" height = "30" className = {styles.boticon} priority = {true} /> : <Image src = "/usericon.svg" alt = "Me" width = "30" height = "30" className = {styles.usericon} priority = {true} />}
              <div className = {styles.markdownanswer}>
                {/* Messages are being rendered in Markdown format */}
                <ReactMarkdown linkTarget = {"_blank"}>{message.message}</ReactMarkdown>
                </div>
              </div>
          )
        })}
        </div>
            </div>
           <div className={styles.center}>
            
            <div className = {styles.cloudform}>
           <form onSubmit = {handleSubmit}>
          <textarea 
          disabled = {loading}
          onKeyDown={handleEnter}
          ref = {textAreaRef}
          autoFocus = {false}
          rows = {1}
          maxLength = {512}
          type="text" 
          id="userInput" 
          name="userInput" 
          placeholder = {loading? "Waiting for response..." : "Type your question..."}  
          value = {userInput} 
          onChange = {e => setUserInput(e.target.value)} 
          className = {styles.textarea}
          />
            <button 
            type = "submit" 
            disabled = {loading}
            className = {styles.generatebutton}
            >
            {loading ? <div className = {styles.loadingwheel}><CircularProgress color="inherit" size = {20}/> </div> : 
            // Send icon SVG in input field
            <svg viewBox='0 0 20 20' className={styles.svgicon} xmlns='http://www.w3.org/2000/svg'>
            <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z'></path>
          </svg>}
            </button>
            </form>
            </div>
            <div className = {styles.footer}>
            <p>Built with ❤️ from San Francisco</p>
            </div>
        </div>
      </main>
    </>
  )
}