import React, { useEffect } from 'react';

const Europeantours = () => {
    useEffect(() => {
        // Load the Europamundo resizing script
        const script = document.createElement('script');
        script.src = 'https://www.europamundo.com/embed_v2/assets/scripts/iframeResizeHeight.min.js';
        script.type = 'text/javascript';
        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            const existingScript = document.querySelector(`script[src="${script.src}"]`);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    return (
        <div className="w-full bg-white">
            <div className="w-full min-h-[800px]">
                <iframe
                    id='frame_cmp'
                    src='https://www.europamundo.com/eng/embed/multisearch.aspx?opeIP=499&ageKEY=48138'
                    frameBorder='0'
                    scrolling='auto'
                    style={{ width: '100%', overflowX: 'hidden', minHeight: '800px', border: 'none' }}
                    data-opeid='499'
                    data-ageid='48138'
                    title="Europamundo Vacations Multisearch"
                ></iframe>
            </div>
            <div className="py-2 text-center text-[10px] text-gray-400 bg-white border-t border-gray-50">
                Integration by Europamundo Vacations
            </div>
        </div>
    );
};

export default Europeantours;
