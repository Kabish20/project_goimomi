import { useEffect } from 'react';

const usePageSEO = (title, description) => {
  useEffect(() => {
    // Set document title
    if (title) {
      document.title = title;
    }

    // Set meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = description;
        document.head.appendChild(metaDescription);
      }
    }

    // Set Open Graph tags
    if (title) {
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    }
    if (description) {
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    }
    // Set Open Graph URL
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', window.location.href);

  }, [title, description]);
};

export default usePageSEO;
