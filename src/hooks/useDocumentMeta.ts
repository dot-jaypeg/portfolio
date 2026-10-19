import { useEffect } from 'react'

// No meta/SEO library in this project -- plain DOM writes, restored on
// cleanup so a page that unmounts (route change) doesn't leak its
// title/description into whatever mounts next before that page's own
// effect has a chance to run.
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const createdMeta = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const previousContent = meta.content
    meta.content = description

    return () => {
      document.title = previousTitle
      if (createdMeta) {
        meta.remove()
      } else {
        meta.content = previousContent
      }
    }
  }, [title, description])
}
