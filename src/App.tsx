import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { AllWork } from './pages/AllWork'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work" element={<AllWork />} />
    </Routes>
  )
}

export default App
