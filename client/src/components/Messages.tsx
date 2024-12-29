import { useContext, useState } from "react"
import { AuthContext } from "../pages/AuthPage";

interface Attachment {
  id: number,
  data: string,
  name: string,
}

export interface Message {
  id: number,
  text: string,
  authorId: number,
  receiverId: number,
  createdAt: Date,
  editedAt: Date,
  attachment?: Attachment[],
  author: { name: string }
}

function Messages({ messages, deleteMessage, editMessage }: { messages: Message[], deleteMessage: (messageId: number) => void, editMessage: (messageId: number, newMessage: string) => void }) {
  const auth = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState<string>('');
  const enterNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)

  return <>
    <ul className='flex flex-col gap-5 items-center w-full mx-auto max-h-screen overflow-y-scroll pb-20'>
      {
        messages.map(msg => (
          <li className='list-none bg-white w-3/5 p-5 rounded-lg' key={msg.id}>
            <p className="font-bold mb-2">{msg.author.name}</p>
            <p>{msg.text}</p>
            <div className='text-end'>
              {
                msg.attachment && msg.attachment.length > 0? 
                msg.attachment.map(file => (
                  <div key={Math.random()} className="my-2 text-start">
                    <span>
                      {file.name}
                    </span>
                    <a className="underline ml-3 text-blue-500 inline" href={`data:text/plain;charset=utf-8,${encodeURIComponent(file.data)}`} download={file.name}>
                      Download
                    </a>
                  </div>
                )) : ''
              }
              <div  className="relative">  
                { 
                  msg.author.name === auth.user?.username && <>
                    <details className='text-gray-500 hover:underline'>
                      <summary>Edit</summary>
                      <div className="absolute right-0 bg-white p-5 shadow-md">
                        <input className="border-2 border-gray-300 px-3" onChange={enterNewMessage} type="text" placeholder="Type new text here"/>
                        <button disabled={newMessage.length === 0} className="ml-5" onClick={() => editMessage(msg.id, newMessage)}>
                          Ok
                        </button>
                      </div>
                    </details>
                    <button className='ml-3 text-red-500 hover:underline' onClick={() => deleteMessage(msg.id)}>Delete</button>
                  </>
                }              
              </div>
            </div>
          </li>
        ))
      }
    </ul>
  </>
}

export default Messages