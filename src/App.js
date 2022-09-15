import "./App.css";

import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRef, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyClDrUCtiy6QSU73Rl7e4vD4NKXRavA9cI",
  authDomain: "chat-application-cba7b.firebaseapp.com",
  databaseURL:
    "https://chat-application-cba7b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-application-cba7b",
  storageBucket: "chat-application-cba7b.appspot.com",
  messagingSenderId: "640857833800",
  appId: "1:640857833800:web:90e9b594bd7e6a46a4f37d",
  measurementId: "G-S0QM18J44Q",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);
  return <div className="App">
    <header>
        <h1>Chat App</h1>
        <SignOut />
      </header>
    <section>
    {user ? <ChatRoom /> : <SingIn />}
    </section>
    </div>
}

function SingIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return <button onClick={signInWithGoogle}>Sign In With Google</button>;
}
function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
}
function ChatRoom() {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages, , , snapshot] = useCollectionData(q);

  const [formValue, setFormValue] = useState('')

  const dummy = useRef();

  const sendMessage = async(e) =>{
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;

    await addDoc(collection(db,"messages"), {
      text: `${formValue}`,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }
  return (
    <>
      <main>
        {messages &&
          messages.map((msg, index) => (
            <ChatMessage key={snapshot.docs[index].id} message={msg} />
          ))}

            <div ref={dummy}></div>

      </main>
  
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={e=> setFormValue(e.target.value)}/>
        <button type="submit">Send message</button>
      </form>
    </>
  );
}
function ChatMessage({ message }) {
  const { text, uid, photoURL } = message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="drop"/>
      <p>{text}</p>
    </div>
  )
}
export default App;
