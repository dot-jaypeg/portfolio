import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { AllWork } from './pages/AllWork'
import { Gallery } from './pages/Gallery'
import { ProjectDetail } from './pages/ProjectDetail'
import { PageMask } from './components/PageMask'

function App() {
  // Mounted here, not inside either page, so `window.__maskTransition`
  // survives the swap between routes -- a component rendered inside
  // <Routes> unmounts (and tears down its effects) the instant React
  // Router replaces it with the other route's element, which is too
  // early for a transition that's supposed to cover BOTH the outgoing
  // and incoming page.
  return (
    <>
      <PageMask />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<AllWork />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:slug" element={<ProjectDetail />} />
      </Routes>
    </>
  )
}

export default App
