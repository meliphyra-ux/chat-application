import './App.css';


import { initializeApp } from 'firebase/app'
import { collection, getFirestore, limit, orderBy, query } from 'firebase/firestore'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'  

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyClDrUCtiy6QSU73Rl7e4vD4NKXRavA9cI",
  authDomain: "chat-application-cba7b.firebaseapp.com",
  databaseURL: "https://chat-application-cba7b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-application-cba7b",
  storageBucket: "chat-application-cba7b.appspot.com",
  messagingSenderId: "640857833800",
  appId: "1:640857833800:web:90e9b594bd7e6a46a4f37d",
  measurementId: "G-S0QM18J44Q"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth();
const db = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      {user ? <ChatRoom /> : <SingIn />}
    </div>
  );
}

function SingIn(){
  const signInWithGoogle = () =>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }
  return <button onClick={signInWithGoogle}>Sign In With Google</button>
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()}>Sign out</button>
  )
}
function ChatRoom(){
  
  const messagesRef = collection(db,'messages');
  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  
  const [messages, loading, error, snapshot] = useCollectionData(q);
  console.log(loading, error)
  return (
    <>
      <div>
        {messages && messages.map((msg, index) => <ChatMessage key={snapshot.docs[index].id} message={msg}/>)}
      </div>
    </>
  )

}
function ChatMessage({message}){
  
  return <p>{message.text}</p>
}
export default App;
