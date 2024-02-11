import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import { observer } from 'mobx-react'
import rootStore from './stores'

const App = observer(() => {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login></Login>

    </>
  )
})

export default App
