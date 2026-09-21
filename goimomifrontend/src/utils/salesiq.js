let waitingForInteraction = false;

export function loadSalesIQOnInteraction() {
  if (document.getElementById('zsiqscript') || waitingForInteraction) return;
  const load = () => {
    document.removeEventListener('pointerdown', onInteraction);
    document.removeEventListener('keydown', onInteraction);
    waitingForInteraction = false;
    if (document.getElementById('zsiqscript')) return;
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || {
      widgetcode: 'siq728d0317d0309852f4889fdec03e4cabaa5c80fa1a246bd2cdb3b355a354df81',
      values: {},
      ready() {},
    };
    const script = document.createElement('script');
    script.id = 'zsiqscript';
    script.src = 'https://salesiq.zoho.in/widget';
    script.async = true;
    document.head.appendChild(script);
  };
  const onInteraction = event => { if (event.isTrusted) load(); };
  // The chat widget plays notification sounds. Do not initialize it from a timed
  // popup before the browser has received a real user gesture.
  if (navigator.userActivation?.hasBeenActive) load();
  else {
    waitingForInteraction = true;
    document.addEventListener('pointerdown', onInteraction);
    document.addEventListener('keydown', onInteraction);
  }
}
