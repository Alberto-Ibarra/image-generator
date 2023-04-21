import './App.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Configuration, OpenAIApi }  from "openai";
import getConfig from 'next/config';
import {useState, useEffect} from 'react';



export default function App({ Component, pageProps }: AppProps) {
  const [result, setResult] = useState('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTs4XdD00sHtFKBYeyzKvz1CUHr598N0yrUA&usqp=CAU')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [typedText, setTypeTexted] = useState('')
  const text = " Creating image...Please wait"

  //getting apikey from next-env.d.ts  **requires getConfig import**
  const {publicRuntimeConfig} =getConfig()
  const apiKey = (typeof publicRuntimeConfig !== 'undefined' && publicRuntimeConfig.apiKey) ? publicRuntimeConfig.apiKey : process.env.API_KEY
  if(!apiKey){
    throw new Error('apiKey is not defined in config file')
  }
  //configuring apikey
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  //adding key to openai
  const openai = new OpenAIApi(configuration);


  //generate image function
  const generateImage = async () => {
    setLoading(true)
    if(prompt === ""){
      alert('Enter Something!')
      setLoading(false)
      return
    }
    //fetching data
    const response = await openai.createImage({
      prompt: prompt,
      n: 2,
      size: "512x512",
  });
  setLoading(false)
  //dot notation for incoming data
  const data = response.data
  setResult(data.data[0].url || 'no image found')
  }

  useEffect(()=>{
    if(loading){
      let i = 0
      const typing = setInterval(()=> {
        setTypeTexted(text.slice(0,i))
        i++
        if(i > text.length + 1){
          i = 0
          setTypeTexted("")
        }
      }, 100)
      return () => clearInterval(typing)
    }
  },[loading])


  return <div className='flex flex-col items-center h-screen' >
    <h2 className='text-yellow-300 my-8 text-center opacity-90 text-2xl md:text-4xl font-bold'>Create Images With You Imagination</h2>
    <textarea 
      className='w-96 h-32 mb-10 p-1 shadow-xl rounded' 
      placeholder='Create any type of image you can think of with as much description as you like'
      onChange={(e => setPrompt(e.target.value))}
      required
    />
    <button 
      className="bg-yellow-300 hover:bg-amber-300 text-white font-bold py-2 px-4 rounded mb-20"
      onClick={generateImage}
    >
      Generate Image
    </button>
    <>
      {loading ? (
        <div>
          <h2 className='text-xl'>{typedText}</h2>
          <div className='ld-ripple'>
            <div></div>
            <div></div>
          </div>
        </div>
      ) :
        <img 
          src={result}
          className='w-80 h-80 p-1 shadow-lg shadow-lime-300 mb-20 rounded'
          />
      }
    </>
  </div>
}
