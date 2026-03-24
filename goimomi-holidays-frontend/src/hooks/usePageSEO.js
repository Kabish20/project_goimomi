import { useEffect } from 'react';

const usePageSEO = (title, description, ogImage = 'https://goimomi.com/logo-preview.png', ogType = 'website') => {
  useEffect(() => {
    // 1. Set document title
    if (title) {
      document.title = title;
    }

    // 2. Set Meta Description
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

    // 3. Set Open Graph tags (Facebook/WhatsApp)
    const setMetaProperty = (property, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        el.setAttribute('content', content);
        document.head.appendChild(el);
      }
    };

    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:image', ogImage);
    setMetaProperty('og:type', ogType);
    setMetaProperty('og:url', window.location.href);

    // 4. Set Twitter tags
    const setMetaName = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        el.setAttribute('content', content);
        document.head.appendChild(el);
      }
    };

    setMetaName('twitter:title', title);
    setMetaName('twitter:description', description);
    setMetaName('twitter:image', ogImage);
    setMetaName('twitter:card', 'summary_large_image');

  }, [title, description, ogImage, ogType]);
};

export default usePageSEO;
