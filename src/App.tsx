import { useState } from 'react';
import './App.css'
import AllBlogPosts from './components/AllPosts'
import Login from './components/Login';
import PostForm from './components/PostForm';
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [token, setToken] = useState<string>();

  return (
    <HashRouter>
      <Routes>
          <Route index element={<Login setToken={setToken} />}/>
          <Route path='/posts' element={<AllBlogPosts token={token}/>}/>
          <Route path='/posts/create-post' element={<PostForm token={token}/>}/>
          <Route path='/posts/:postid' element={<PostForm token={token}/>}/>
      </Routes>
    </HashRouter>
  )
}

export default App
