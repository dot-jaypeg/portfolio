import { useNavigate } from 'react-router-dom'

// Routes through the same curtain wipe `PageMask` already uses for
// same-page Nav jumps (About/Contact), so going between actual pages
// (e.g. "/" <-> "/work") feels like the same transition language as
// moving between sections on the homepage, instead of React Router's
// default instant swap. Falls back to a plain navigate if PageMask
// isn't mounted for some reason.
export function useMaskNavigate() {
  const navigate = useNavigate()
  return (to: string) => {
    const jump = () => navigate(to)
    if (window.__maskTransition) {
      window.__maskTransition(jump)
    } else {
      jump()
    }
  }
}
