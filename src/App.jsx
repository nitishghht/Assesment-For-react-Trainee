import { useState } from 'react'
import Navbar from './Components/Navber'
import Dashboard from './Components/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Dashboard />
    </>
  )
}

export default App
