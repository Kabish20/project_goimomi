import re

def process(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Rename Term & Policy
    content = content.replace("Cancellation Policy", "Term & Policy")
    content = content.replace("Trip Information", "Term & Policy")

    # Day Wise Itinerary tabs implementation
    tab_replacement = """
                        <div className="flex items-center gap-3 mb-6 pl-4">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Add to this day:</span>
                          <div className="flex gap-1.5 bg-gray-50/50 p-1 rounded-2xl border border-gray-100/50">
                            {[
                              { id: 'day_itinerary', label: 'Day Itinerary', symbol: '' },
                              { id: 'sightseeing', label: 'Sightseeing', symbol: '+ ' },
                              { id: 'transfers', label: 'Transfers', symbol: '+ ' },
                              { id: 'accommodation', label: 'Accommodation', symbol: '+ ' },
                              { id: 'vehicle', label: 'Vehicle', symbol: '+ ' }
                            ].map(tab => (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                  const copy = [...itineraryDays];
                                  if (!copy[i].details_json) copy[i].details_json = {};
                                  copy[i].details_json.active_tab = tab.id;
                                  setItineraryDays(copy);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${(row.details_json?.active_tab || 'day_itinerary') === tab.id
                                  ? 'bg-[#ffe4e1] text-[#b91c1c] shadow-md scale-105'
                                  : 'text-gray-500 hover:bg-white hover:text-[#14532d]'
                                }`}
                              >
                                {tab.symbol}{tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {(!row.details_json?.active_tab || row.details_json?.active_tab === 'day_itinerary') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4 animate-in fade-in slide-in-from-top-4 duration-500">
"""
    # Just replacing the start of the grid content
    content = content.replace('<div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4">', tab_replacement)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

process(r"d:\G\goimomi-holidays-frontend\src\pages\admin\HolidayPackageAdd.jsx")
process(r"d:\G\goimomi-holidays-frontend\src\pages\admin\HolidayPackageEdit.jsx")
print("Done")
