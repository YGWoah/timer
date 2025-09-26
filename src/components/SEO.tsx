import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  noindex?: boolean
}

export default function SEO({ 
  title = 'FocusTimer - Track Your Productivity Sessions',
  description = 'A simple, effective focus timer to track your work sessions. Set topics, monitor time, and save your productivity data.',
  keywords = 'focus timer, productivity, pomodoro timer, time tracking, work sessions, concentration, study timer, deep work',
  canonical,
  noindex = false
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      metaDescription.setAttribute('content', description)
      document.head.appendChild(metaDescription)
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords)
    } else {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      metaKeywords.setAttribute('content', keywords)
      document.head.appendChild(metaKeywords)
    }

    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', title)
    }

    // Update Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', description)
    }

    // Update Twitter title
    let twitterTitle = document.querySelector('meta[property="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title)
    }

    // Update Twitter description
    let twitterDescription = document.querySelector('meta[property="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description)
    }

    // Update canonical URL if provided
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]')
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonical)
      } else {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        canonicalLink.setAttribute('href', canonical)
        document.head.appendChild(canonicalLink)
      }
    }

    // Update robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]')
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow'
    if (robotsMeta) {
      robotsMeta.setAttribute('content', robotsContent)
    } else {
      robotsMeta = document.createElement('meta')
      robotsMeta.setAttribute('name', 'robots')
      robotsMeta.setAttribute('content', robotsContent)
      document.head.appendChild(robotsMeta)
    }
  }, [title, description, keywords, canonical, noindex])

  return null
}