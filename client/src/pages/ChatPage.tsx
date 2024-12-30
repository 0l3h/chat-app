import io, {Socket} from "socket.io-client"
import { useContext, useEffect, useState } from 'react';
import MessageInput from "../components/MessageInput";
import Messages, { Message } from "../components/Messages";
import { AuthContext } from "./AuthPage";

interface Contact {
  id: number,
  name: string
}

export interface FileUpload {
  fileName: string;
  fileData: ArrayBuffer;
}

function ChatPage() {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[]>([]);
  const auth = useContext(AuthContext);
  const [contacts, setContacts] = useState<Contact[]>();
  const [contactPhoneNumber, setContactPhoneNumber] = useState<string>('');
  const [contactId, setContactId] = useState<number | undefined>();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isConnected, setConnected] = useState<boolean>(false);


  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const filesData = event.target.files;
    if(filesData.length > 0) {
      const newFiles: FileUpload[] = [];

      Array.from(filesData).forEach(f => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileData: FileUpload = {
            fileName: f.name,
            fileData: reader.result as ArrayBuffer,
          };
          newFiles.push(fileData);
          if (newFiles.length === filesData.length) {
            setFiles([...newFiles]);
          }
        };
        reader.readAsArrayBuffer(f);
      })
    }
  };

  const send = (message: string) => {
    if(files.length > 0)
      socket?.emit("message", {authorId: auth.user?.id, receiverId: contactId, message, files});
    else
      socket?.emit("message", {authorId: auth.user?.id, receiverId: contactId, message});

    socket?.on('message', (m: Message) => {
      console.log(m);
      setMessages([...messages, m]);
    })

    setFiles([]);
  }

  const chooseChat = (contactId: number) => {
    setContactId(contactId);
    getMessages(auth.user?.id!, contactId);
  }

  const getMessages = async (authorId:number, receiverId:number) => {
    setContactId(receiverId);
    socket?.emit("get-messages", {authorId, receiverId } )
    socket?.on("get-messages", (allMessages) => {
      setMessages([...allMessages])
    })
  }

  const getContacts = async () => {
    console.log(auth.token);

    socket?.emit("get-contacts", { userId: auth.user?.id });
    socket?.on("get-contacts", (allContacts: Contact[]) => {
      setContacts(allContacts);
    });
  };

  const addContact = async (phoneNumber: string) => {
    socket?.emit("add-contact", { userId: auth.user?.id, contactPhoneNumber: phoneNumber })
    getContacts();
  }

  const deleteMessage = async (messageId: number) => {
    socket?.emit("delete-message", { messageId })
    const filteredMessages = messages.filter(m => m.id !== messageId)
    setMessages([...filteredMessages]);
  }

  const editMessage = async (messageId: number, newText: string) => {
    socket?.emit("edit-message", { messageId, newText });
    
  }

  useEffect(() => {
    const newSocket = io(import.meta.env.PROD ? "https://server-production-3303.up.railway.app/" : "http://localhost:7000", {
      transports: ['websocket', 'polling', 'flashsocket'],
      auth: {
        token: auth.token
      }
    })
    setSocket(newSocket)
    newSocket?.on('connect', () => {
      setConnected(true);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getContacts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <div>
      <main className="bg-gray-100 h-screen flex">
        <section className="bg-white p-5 w-1/3 h-full">
          <form onSubmit={e => e.preventDefault()} className="flex gap-3 flex-col mb-5">
            <label htmlFor="contactNumber" className="font-bold text-xl">Add contact</label>
            <input type="text" name="contactNumber" required className="border-2 border-gray-100 w-full px-3 py-2" onChange={e => setContactPhoneNumber(e.target.value)} value={contactPhoneNumber} placeholder="Phone number"/>
            <button className="text-white bg-blue-600 py-2 rounded-md" onClick={() => addContact(contactPhoneNumber)}>Add contact</button>
          </form>
          <h1 className="font-bold text-xl mt-5 mb-3">Profile</h1>
          <p>{auth.user?.username}</p>
          <button className="text-blue-500 border-2 border-blue-500 py-2 w-full rounded-md mt-5">Log out</button>
          <h1 className="font-bold text-xl mt-5 mb-3">Contacts</h1>
          <ul className="flex flex-col gap-3">
            {
              contacts && contacts.length > 0 && contacts.map(c => (
                <li key={Math.random()} onClick={() => chooseChat(c.id)}>{c?.name}</li>
              ))
            }
          </ul>
        </section>
        <section className="flex flex-col w-full items-center">
          <Messages editMessage={editMessage} deleteMessage={deleteMessage} messages={messages}/>
          {contactId && <MessageInput uploadFile={uploadFile} send={send}/>}
        </section>
      </main>
    </div>
  )
}

export default ChatPage;