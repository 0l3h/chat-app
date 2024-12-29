import React, {useState} from 'react'

function MessageInput({ send, uploadFile }: { send: (message: string) => void, uploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void}) {
  const [value, setValue] = useState("");
  
  return (
    <div className='mb-5 mt-auto mx-auto w-fit absolute bottom-0'>
      <input multiple={true} className='bg-blue-600 mr-3 text-white rounded-md p-3' type='file' onChange={uploadFile}/>
      <input placeholder='Type your message here...' className='shadow-lg mr-3 p-3 rounded-md' onChange={e => setValue(e.target.value)} value={value}/>
      <button type='submit' className='bg-blue-600 font-bold text-white py-3 px-5 rounded-md' onClick={() => send(value)}>Send</button>
    </div>
  )
}

export default MessageInput