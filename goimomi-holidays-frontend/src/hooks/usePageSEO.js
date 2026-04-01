import { useEffect } from 'react';

const usePageSEO = (title, description, ogImage = 'https://goimomi.com/logo-preview.png', keywords = '', ogType = 'website') => {
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

      // Also set itemprop description for WhatsApp
      let itemPropDescription = document.querySelector('meta[itemprop="description"]');
      if (itemPropDescription) {
        itemPropDescription.setAttribute('content', description);
      }
    }

    // 3. Set Meta Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        metaKeywords.content = keywords;
        document.head.appendChild(metaKeywords);
      }
    }

    // 4. Set Open Graph tags (Facebook/WhatsApp)
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

    // 5. Set Twitter tags
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

    // 6. Set Schema.org itemprop tags (Extra for WhatsApp/Search)
    const setItemProp = (name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[itemprop="${name}"]`);
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        el.setAttribute('itemprop', name);
        el.setAttribute('content', content);
        document.head.appendChild(el);
      }
    };
    setItemProp('name', title);
    setItemProp('description', description);
    setItemProp('image', ogImage);

    // 7. Set Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.href);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', window.location.href);
      document.head.appendChild(canonical);
    }

  }, [title, description, ogImage, keywords, ogType]);
};

export default usePageSEO;
