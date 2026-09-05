import React from 'react';
import usePageSEO from '../../../hooks/usePageSEO';

const ZOHO_SHEET_URL =
  'https://sheet.zohopublic.in/sheet/published/umq2mc0806074b948468a987801e80675ad36';

const VisaRateCardB2B = () => {
  usePageSEO(
    'B2B Visa Rate Card | Goimomi Holidays',
    'Goimomi Holidays B2B Visa Rate Card',
    null,
    'B2B visa rate card'
  );

  return (
    <div className="w-full bg-white">
      <div className="w-full h-[calc(100vh-80px)] min-h-[800px]">
        <iframe
          src={ZOHO_SHEET_URL}
          title="B2B Visa Rate Card"
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
};

export default VisaRateCardB2B;
