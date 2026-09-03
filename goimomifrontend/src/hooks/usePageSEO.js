import { useEffect } from 'react';

const DEFAULT_SHARE_IMAGE = 'https://goimomi.com/logo.png';
const NO_INDEX_PATHS = [
  /^\/admin(?:\/|$)/i,
  /^\/admin-login(?:\/|$)/i,
  /^\/(?:admin-dashboard|admindashboard|test)(?:\/|$)/i,
  /^\/(?:payment|payment-failed|payment-checkout)(?:\/|$)/i,
  /^\/(?:form|enquiry)(?:\/|$)/i,
  /^\/visa\/(?:results|apply)(?:\/|$)/i,
  /^\/umrah-package(?:\/|$)/i,
  /^\/contact\/success(?:\/|$)/i,
  /^\/goimomi-product(?:\/|$)/i,
];
const CANONICAL_PATHS = {
  '/goimomi-product': '/shop',
};

const usePageSEO = (title, description, ogImage = DEFAULT_SHARE_IMAGE, keywords = '', ogType = 'website') => {
  useEffect(() => {
    const shareImage = ogImage ? new URL(ogImage, window.location.origin).href : DEFAULT_SHARE_IMAGE;

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
    setMetaProperty('og:image', shareImage);
    setMetaProperty('og:image:alt', title ? `${title} | Goimomi Holidays` : 'Goimomi Holidays');
    setMetaProperty('og:type', ogType);
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const canonicalPath = CANONICAL_PATHS[currentPath] || currentPath;
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;
    setMetaProperty('og:url', canonicalUrl);

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
    setMetaName('twitter:image', shareImage);
    setMetaName('twitter:card', 'summary_large_image');
    setMetaName('twitter:image:alt', title ? `${title} | Goimomi Holidays` : 'Goimomi Holidays');
    setMetaName('robots', NO_INDEX_PATHS.some((pattern) => pattern.test(window.location.pathname)) ? 'noindex, nofollow' : 'index, follow');

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
    setItemProp('image', shareImage);

    // 7. Set Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonical);
    }

  }, [title, description, ogImage, keywords, ogType]);
};

export default usePageSEO;
