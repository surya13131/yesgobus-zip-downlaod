'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Imported for routing
import Home4 from '../HomeFour/page';
import { fetchCitySuggestions } from '../api';

// Adjust this import path to wherever your cityMapping is actually exported
// @ts-ignore
import { cityMapping } from '../cityMapping'; 

// Tourism Assets
import chikkamagaluru from '../assest/chikamanagluru.png';
import mysore from '../assest/mysore.png';
import coimbatore from '../assest/coimbatore.png';
import madurai from '../assest/madurai.png';
import bengaluru from '../assest/bangalore.png';
import hyderabad from '../assest/hyderabad.png';
import pune from '../assest/pune.png';
import chennai from '../assest/chennai.png';
import delhi from '../assest/delhi.png';
import mumbai from '../assest/mumbai.png';
import indore from '../assest/indore.png';
import ahmedabad from '../assest/ahemabdabad.png';
import goa from '../assest/goa.png';

// Feature Icons
import safetyIcon from '../assest/safety.png'; 
import supportIcon from '../assest/support.png';
import comfortIcon from '../assest/comfort.png';
import travelEasyIcon from '../assest/travel.png';
import globalBrandIcon from '../assest/globe.png';
import lowestChargeIcon from '../assest/ticket.png';

// --- LOCAL TRANSLATIONS ---
const translations: Record<string, any> = {
  EN: {
    tourismTitle: "Tourism All Over India",
    showLess: "SHOW LESS",
    viewMore: "VIEW MORE",
    whyChooseTitle1: "WHY CHOOSE",
    whyChooseTitle2: "YESGOBUS",
    whyChooseTitle3: "FOR BUS",
    whyChooseTitle4: "TICKET BOOKING",
    safety: "Safety & Trust",
    support: "24/7 Customer Support",
    comfort: "Comfort on Board",
    travelEasy: "Travel Made Easy",
    globalBrand: "Largest Global Bus Brand",
    lowestCharge: "Lowest Ticket Charges",
    reviewsTitle: "Reviews for YesGoBus",
    to: "To"
  },
  TA: {
    tourismTitle: "இந்தியா முழுவதும் சுற்றுலா",
    showLess: "குறைவாக காட்டு",
    viewMore: "மேலும் காண்க",
    whyChooseTitle1: "ஏன் தேர்வு செய்ய வேண்டும்",
    whyChooseTitle2: "YESGOBUS",
    whyChooseTitle3: "பேருந்து",
    whyChooseTitle4: "டிக்கெட் முன்பதிவுக்கு",
    safety: "பாதுகாப்பு & நம்பிக்கை",
    support: "24/7 வாடிக்கையாளர் ஆதரவு",
    comfort: "பயணத்தில் வசதி",
    travelEasy: "பயணம் எளிதாக்கப்பட்டது",
    globalBrand: "மிகப்பெரிய உலகளாவிய பேருந்து பிராண்ட்",
    lowestCharge: "மிகக் குறைந்த டிக்கெட் கட்டணம்",
    reviewsTitle: "YesGoBus க்கான மதிப்புரைகள்",
    to: "சேருமிடம்"
  },
  KN: {
    tourismTitle: "ಭಾರತದಾದ್ಯಂತ ಪ್ರವಾಸೋದ್ಯಮ",
    showLess: "ಕಡಿಮೆ ತೋರಿಸಿ",
    viewMore: "ಇನ್ನಷ್ಟು ವೀಕ್ಷಿಸಿ",
    whyChooseTitle1: "ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು",
    whyChooseTitle2: "YESGOBUS",
    whyChooseTitle3: "ಬಸ್",
    whyChooseTitle4: "ಟಿಕೆಟ್ ಬುಕಿಂಗ್‌ಗಾಗಿ",
    safety: "ಸುರಕ್ಷತೆ ಮತ್ತು ನಂಬಿಕೆ",
    support: "24/7 ಗ್ರಾಹಕ ಬೆಂಬಲ",
    comfort: "ಪ್ರಯಾಣದಲ್ಲಿ ಆರಾಮ",
    travelEasy: "ಪ್ರಯಾಣ ಸುಲಭವಾಗಿದೆ",
    globalBrand: "ಅತಿದೊಡ್ಡ ಜಾಗತಿಕ ಬಸ್ ಬ್ರಾಂಡ್",
    lowestCharge: "ಕಡಿಮೆ ಟಿಕೆಟ್ ದರಗಳು",
    reviewsTitle: "YesGoBus ಗಾಗಿ ವಿಮರ್ಶೆಗಳು",
    to: "ಗಮ್ಯಸ್ಥಾನ"
  },
  TE: {
    tourismTitle: "భారతదేశం అంతటా పర్యాటకం",
    showLess: "తక్కువ చూపించు",
    viewMore: "మరింత వీక్షించండి",
    whyChooseTitle1: "ఎందుకు ఎంచుకోవాలి",
    whyChooseTitle2: "YESGOBUS",
    whyChooseTitle3: "బస్సు",
    whyChooseTitle4: "టిక్కెట్ బుకింగ్ కోసం",
    safety: "భద్రత & నమ్మకం",
    support: "24/7 కస్టమర్ సపోర్ట్",
    comfort: "ప్రయాణంలో సౌకర్యం",
    travelEasy: "ప్రయాణం సులభం చేయబడింది",
    globalBrand: "అతిపెద్ద గ్లోబల్ బస్ బ్రాండ్",
    lowestCharge: "అతి తక్కువ టిక్కెట్ ఛార్జీలు",
    reviewsTitle: "YesGoBus కోసం సమీక్షలు",
    to: "గమ్యం"
  },
  ML: {
    tourismTitle: "ഇന്ത്യയിലുടനീളം ടൂറിസം",
    showLess: "കുറച്ച് കാണിക്കുക",
    viewMore: "കൂടുതൽ കാണുക",
    whyChooseTitle1: "എന്തുകൊണ്ട് തിരഞ്ഞെടുക്കണം",
    whyChooseTitle2: "YESGOBUS",
    whyChooseTitle3: "ബസ്",
    whyChooseTitle4: "ടിക്കറ്റ് ബുക്കിംഗിനായി",
    safety: "സുരക്ഷയും വിശ്വാസവും",
    support: "24/7 ഉപഭോക്തൃ പിന്തുണ",
    comfort: "യാത്രയിലെ സുഖം",
    travelEasy: "യാത്ര എളുപ്പമാക്കി",
    globalBrand: "ഏറ്റവും വലിയ ആഗോള ബസ് ബ്രാൻഡ്",
    lowestCharge: "ഏറ്റവും കുറഞ്ഞ ടിക്കറ്റ് നിരക്കുകൾ",
    reviewsTitle: "YesGoBus-നുള്ള അവലോകനങ്ങൾ",
    to: "ലക്ഷ്യസ്ഥാനം"
  }
};

// --- DYNAMIC CITY NAME TRANSLATIONS ---
const cityTranslations: Record<string, Record<string, string>> = {
  "Bengaluru": { EN: "Bengaluru", TA: "பெங்களூரு", KN: "ಬೆಂಗಳೂರು", TE: "బెంగళూరు", ML: "ബെംഗളൂരു" },
  "Hyderabad": { EN: "Hyderabad", TA: "ஹைதராபாத்", KN: "ಹೈದರಾಬಾದ್", TE: "హైదరాబాద్", ML: "ഹൈദരാബാദ്" },
  "Pune": { EN: "Pune", TA: "புனே", KN: "ಪುಣೆ", TE: "పూణే", ML: "പൂനെ" },
  "Chennai": { EN: "Chennai", TA: "சென்னை", KN: "ಚೆನ್ನೈ", TE: "చెన్నై", ML: "ചെന്നൈ" },
  "Delhi": { EN: "Delhi", TA: "டெல்லி", KN: "ದೆಹಲಿ", TE: "ఢిల్లీ", ML: "ഡൽഹി" },
  "Mumbai": { EN: "Mumbai", TA: "மும்பை", KN: "ಮುಂಬೈ", TE: "ముంబై", ML: "മുംബൈ" },
  "Indore": { EN: "Indore", TA: "இந்தூர்", KN: "ಇಂದೋರ್", TE: "ఇండోర్", ML: "ഇൻഡോർ" },
  "Ahmedabad": { EN: "Ahmedabad", TA: "அகமதாபாத்", KN: "ಅಹಮದಾಬಾದ್", TE: "అహ్మదాబాద్", ML: "അഹമ്മദാബാദ്" },
  "Goa": { EN: "Goa", TA: "கோவா", KN: "ಗೋವಾ", TE: "గోవా", ML: "ഗോവ" },
  "Chikkamagaluru": { EN: "Chikkamagaluru", TA: "சிக்கமகளூரு", KN: "ಚಿಕ್ಕಮಗಳೂರು", TE: "చిక్కమగళూరు", ML: "ചിക്കമംഗളൂരു" },
  "Mysore": { EN: "Mysore", TA: "மைசூர்", KN: "ಮೈಸೂರು", TE: "మైసూర్", ML: "മൈസൂർ" },
  "Coimbatore": { EN: "Coimbatore", TA: "கோயம்புத்தூர்", KN: "ಕೊಯಮತ್ತೂರು", TE: "కోయంబత్తూర్", ML: "കോയമ്പത്തൂർ" },
  "Madurai": { EN: "Madurai", TA: "மதுரை", KN: "ಮಧುರೈ", TE: "మదురై", ML: "മധുര" },
  "Manali": { EN: "Manali", TA: "மணாலி", KN: "ಮನಾಲಿ", TE: "మనాలి", ML: "മണാലി" },
  "Jaipur": { EN: "Jaipur", TA: "ஜெய்ப்பூர்", KN: "ಜೈಪುರ", TE: "జైపూర్", ML: "ജയ്പൂർ" },
  "Amritsar": { EN: "Amritsar", TA: "அமிர்தசரஸ்", KN: "ಅಮೃತಸರ", TE: "అమృత్‌సర్", ML: "അമൃത്സർ" },
  "Lucknow": { EN: "Lucknow", TA: "லக்னோ", KN: "ಲಕ್ನೋ", TE: "లక్నో", ML: "ലഖ്നൗ" },
  "Shimla": { EN: "Shimla", TA: "சிம்லா", KN: "ಶಿಮ್ಲಾ", TE: "సిమ్లా", ML: "ഷിംല" },
  "Nagpur": { EN: "Nagpur", TA: "நாக்பூர்", KN: "ನಾಗ್ಪುರ", TE: "నాగ్‌పూర్", ML: "നാഗ്പൂർ" },
  "Jamnagar": { EN: "Jamnagar", TA: "ஜாம்நகர்", KN: "ಜಾಮ್‌ನಗರ", TE: "జామ్‌నగర్", ML: "ജാംനഗർ" },
  "Udaipur": { EN: "Udaipur", TA: "உதய்பூர்", KN: "ಉದಯಪುರ", TE: "ఉదయపూర్", ML: "ഉദയ്പൂർ" },
  "Rajkot": { EN: "Rajkot", TA: "ராஜ்கோட்", KN: "ರಾಜ್‌ಕೋಟ್", TE: "రాజ్‌కోట్", ML: "രാജ്കോട്ട്" },
  "Kolhapur": { EN: "Kolhapur", TA: "கோலாப்பூர்", KN: "ಕೊಲ್ಹಾಪುರ", TE: "కొల్హాపూర్", ML: "കോലാപ്പൂർ" },
  "Mangaluru": { EN: "Mangaluru", TA: "மங்களூரு", KN: "ಮಂಗಳೂರು", TE: "మంగళూరు", ML: "മംഗളൂരു" },
  "Hassan": { EN: "Hassan", TA: "ஹாசன்", KN: "ಹಾಸನ", TE: "హాసన్", ML: "ഹാസൻ" },
  "Ooty": { EN: "Ooty", TA: "ஊட்டி", KN: "ಊಟಿ", TE: "ఊటీ", ML: "ഊട്ടി" },
  "Coorg": { EN: "Coorg", TA: "கூர்ர்க்", KN: "ಕೊಡಗು", TE: "కూర్గ్", ML: "കూర్ഗ്" },
  "Tirunelveli": { EN: "Tirunelveli", TA: "திருநெல்வேலி", KN: "ತಿರುನೆಲ್ವೇಲಿ", TE: "తిరునెల్వేలి", ML: "തിരുനെൽവേലി" },
  "Ahmednagar": { EN: "Ahmednagar", TA: "அகமதுநகர்", KN: "ಅಹಮದ್‌ನಗರ", TE: "అహ్మద్‌నగర్", ML: "അഹമ്മദ്‌നഗർ" }
};

const TourismAndWhyChoose: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null); // State to track clicked source card
  const [clickedRoute, setClickedRoute] = useState<string | null>(null); // State to track the specifically clicked destination link
  const router = useRouter(); 

  // Language State
  const [currentLang, setCurrentLang] = useState('EN');

  // GLOBAL LANGUAGE LISTENER (Listens to the Navbar)
  useEffect(() => {
    const savedLang = localStorage.getItem('yesgo_lang');
    if (savedLang) setCurrentLang(savedLang);

    const handleLanguageUpdate = () => {
      const updatedLang = localStorage.getItem('yesgo_lang') || "EN";
      setCurrentLang(updatedLang);
    };

    window.addEventListener('languageChanged', handleLanguageUpdate);
    return () => window.removeEventListener('languageChanged', handleLanguageUpdate);
  }, []);

  const t = translations[currentLang] || translations['EN'];
  const tCity = (cityStr: string) => cityTranslations[cityStr]?.[currentLang] || cityStr;

  // Standardized city names using arrays so we can translate individual destinations easily
  const tourismData = [
    { name: 'Bengaluru', img: bengaluru, destinations: ['Hyderabad', 'Mumbai', 'Goa', 'Chennai', 'Pune'] },
    { name: 'Hyderabad', img: hyderabad, destinations: ['Bengaluru', 'Mumbai', 'Goa', 'Chennai', 'Pune'] },
    { name: 'Pune', img: pune, destinations: ['Bengaluru', 'Goa', 'Indore', 'Nagpur', 'Hyderabad'] },
    { name: 'Chennai', img: chennai, destinations: ['Bengaluru', 'Coimbatore', 'Hyderabad', 'Madurai', 'Tirunelveli'] },
    { name: 'Delhi', img: delhi, destinations: ['Manali', 'Jaipur', 'Amritsar', 'Lucknow', 'Shimla'] },
    { name: 'Mumbai', img: mumbai, destinations: ['Hyderabad', 'Bengaluru', 'Indore', 'Goa', 'Pune'] },
    { name: 'Indore', img: indore, destinations: ['Mumbai', 'Pune', 'Ahmedabad', 'Ahmednagar', 'Nagpur'] },
    { name: 'Ahmedabad', img: ahmedabad, destinations: ['Mumbai', 'Jaipur', 'Jamnagar', 'Udaipur', 'Indore', 'Rajkot'] },
    { name: 'Goa', img: goa, destinations: ['Hyderabad', 'Bengaluru', 'Pune', 'Mumbai', 'Kolhapur'] },
    { name: 'Chikkamagaluru', img: chikkamagaluru, destinations: ['Bengaluru', 'Mangaluru', 'Mysore', 'Hassan'] },
    { name: 'Mysore', img: mysore, destinations: ['Bengaluru', 'Ooty', 'Coorg', 'Chikkamagaluru'] },
    { name: 'Coimbatore', img: coimbatore, destinations: ['Chennai', 'Bengaluru', 'Madurai', 'Ooty'] },
    { name: 'Madurai', img: madurai, destinations: ['Chennai', 'Bengaluru', 'Coimbatore', 'Tirunelveli'] },
  ];

  const displayedCities = showAll ? tourismData : tourismData.slice(0, 9);

  const features = [
    { title: t.safety, icon: safetyIcon },
    { title: t.support, icon: supportIcon },
    { title: t.comfort, icon: comfortIcon },
    { title: t.travelEasy, icon: travelEasyIcon },
    { title: t.globalBrand, icon: globalBrandIcon },
    { title: t.lowestCharge, icon: lowestChargeIcon }
  ];

  const reviews = [
    { name: 'Suresh', time: '2 Hours Ago', rating: 5, title: 'The user interface was easy to book', text: 'The user interface was easy to book, prices were honest and some discount made me smile and overall a very good experience to book through YesGoBus.' },
    { name: 'Rajesh', time: '2 Hours Ago', rating: 5, title: 'Personally taken interest in customer\'s...', text: 'Personally taken interest in customer\'s inquiries at local branch office of Bhayli Vadodara regarding meal arrangements in bus and journey.' },
    { name: 'Sharmila', time: '5 Days Ago', rating: 5, title: 'Try YesGoBus it\'s easy or trusted', text: 'YesGoBus is easy and trusted platform for bus ticket booking. Very happy with service.' },
    { name: 'Mohita', time: '12 Days Ago', rating: 5, title: 'User friendly app.', text: 'Very good experience. Easy to use and great discounts on first booking.' }
  ];

  // Helper function to handle destination click with Mapping
  const handleDestinationClick = async (e: React.MouseEvent, source: string, destination: string) => {
    e.stopPropagation(); // Prevents the card click event from firing
    setClickedRoute(`${source}-${destination}`); // Mark this exact route as clicked for styling

    try {
      const sourceSuggestions = await fetchCitySuggestions(source);
      const destSuggestions = await fetchCitySuggestions(destination);

      const sourceData = sourceSuggestions[0];
      const destData = destSuggestions[0];

      const cleanName = (name: string) => (name || "").split("(")[0].trim();

      const queryParams = new URLSearchParams({
        sourceName: sourceData ? cleanName(sourceData.name) : source,
        destName: destData ? cleanName(destData.name) : destination,
        vrlSourceId: sourceData?.vrlCityId || "",
        vrlDestId: destData?.vrlCityId || "",
        srsSourceId: sourceData?.srsCityId || "",
        srsDestId: destData?.srsCityId || "",
        ezeeSourceCode: sourceData?.ezeeStationCode || "",
        ezeeDestCode: destData?.ezeeStationCode || "",
      });

      router.push(`/bus-list?${queryParams.toString()}`);
    } catch (error) {
      console.error("Error fetching city details:", error);
      // Fallback
      router.push(`/bus-list?sourceName=${source}&destName=${destination}`);
    }
  };

  return (
    <main className="large-screen-container">
      {/* Dynamic CSS for the hover effects on destination links */}
      <style>{`
        .dest-link {
          transition: all 0.2s ease-in-out;
        }
        .dest-link:hover {
          color: #000000 !important;
          text-decoration: underline !important;
        }
      `}</style>

      <div className="bg-white w-100 overflow-hidden">
        <div className='site-wrapper'>
          {/* --- TOURISM GRID --- */}
          <section className="py-5 container-fluid text-center">
            <h2 className="fw-bold mb-1" style={{ color: '#033564', fontSize: '32px' }}>{t.tourismTitle}</h2>
            <div className="mx-auto mb-5" style={{ width: '80px', height: '4px', backgroundColor: '#00A8E8', borderRadius: '2px' }}></div>
            <div className="row g-4 px-lg-5">
              {displayedCities.map((city, idx) => {
                const isSelected = selectedSource === city.name;

                return (
                  <div key={idx} className="col-lg-4 col-md-6 text-start">
                    <div 
                      className="d-flex align-items-center gap-3 p-3 border rounded-4 shadow-sm h-100 bg-white tourism-card border-light"
                      onClick={() => setSelectedSource(isSelected ? null : city.name)}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        border: isSelected ? '2px solid #033564' : '' // Highlight card with dark color when selected
                      }}
                    >
                      <div style={{ width: '85px', height: '85px', position: 'relative', flexShrink: 0 }}>
                        <Image src={city.img} alt={city.name} fill className="rounded-3" style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="w-100">
                        {/* TRANSLATED CITY NAME */}
                        <h6 className="fw-bold mb-1" style={{ fontSize: '18px', color: '#033564' }}>{tCity(city.name)}</h6>
                        
                        {/* Show regular text if not selected, show clickable links if selected */}
                        {!isSelected ? (
                          <p className="text-muted mb-0" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                            {t.to}: {city.destinations.map(d => tCity(d)).join(', ')}
                          </p>
                        ) : (
                          <div className="mt-1 d-flex flex-wrap align-items-center gap-2">
                            <span style={{ fontSize: '12px', color: '#000000', fontWeight: 'bold' }}>{t.to}:</span>
                            {city.destinations.map((dest, i) => {
                              const isThisRouteClicked = clickedRoute === `${city.name}-${dest}`;
                              return (
                                <span
                                  key={i}
                                  className="dest-link"
                                  onClick={(e) => handleDestinationClick(e, city.name, dest)}
                                  style={{ 
                                    cursor: 'pointer', 
                                    color: isThisRouteClicked ? '#000000' : '#495057', 
                                    fontSize: '13px', 
                                    fontWeight: isThisRouteClicked ? 'bold' : '500',
                                    textDecoration: isThisRouteClicked ? 'underline' : 'none',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    backgroundColor: isThisRouteClicked ? '#f1f1f1' : 'transparent'
                                  }}
                                >
                                  {tCity(dest)}{i < city.destinations.length - 1 && !isThisRouteClicked ? ',' : ''}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowAll(!showAll)} className="btn mt-5 px-5 text-white fw-bold shadow-sm" style={{ background: 'linear-gradient(180deg, #0B7194 0%, #03232E 100%)', borderRadius: '25px', padding: '12px 35px' }}>
              {showAll ? t.showLess : t.viewMore}
            </button>
          </section>
        </div>

        {/* --- WHY CHOOSE SECTION --- */}
        <section className="why-choose-section position-relative">
          <div className="bg-doodle-container">
            <i className="bi bi-bicycle" style={{ fontSize: '240px', position: 'absolute', top: '5%', left: '5%', transform: 'rotate(-15deg)' }}></i>
            <i className="bi bi-camera" style={{ fontSize: '180px', position: 'absolute', bottom: '10%', left: '25%', transform: 'rotate(12deg)' }}></i>
            <i className="bi bi-geo-alt" style={{ fontSize: '140px', position: 'absolute', top: '10%', right: '15%' }}></i>
            <i className="bi bi-shield-check" style={{ fontSize: '100px', position: 'absolute', top: '40%', right: '50%' }}></i>
            <i className="bi bi-headset" style={{ fontSize: '110px', position: 'absolute', bottom: '30%', left: '45%' }}></i>
            <i className="bi bi-bus-front" style={{ fontSize: '190px', position: 'absolute', bottom: '-10px', right: '5%' }}></i>
            <i className="bi bi-briefcase" style={{ fontSize: '120px', position: 'absolute', top: '30%', left: '2%' }}></i>
            <i className="bi bi-globe" style={{ fontSize: '115px', position: 'absolute', top: '50%', right: '20%' }}></i>
            <i className="bi bi-ticket" style={{ fontSize: '140px', position: 'absolute', top: '5%', left: '40%', transform: 'rotate(20deg)' }}></i>
            <i className="bi bi-geo" style={{ fontSize: '100px', position: 'absolute', bottom: '5%', left: '5%' }}></i>
          </div>

          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="row align-items-center">
              {/* Left Headline */}
              <div className="col-lg-6 text-start mb-5 mb-lg-0">
                <h1 className="display-4 fw-bold mb-0 text-uppercase" style={{ lineHeight: '1.1', letterSpacing: '-1px' }}>
                  {t.whyChooseTitle1} <br />
                  <span style={{ color: '#FFD700' }}>{t.whyChooseTitle2}</span> <br />
                  {t.whyChooseTitle3} <br />
                  {t.whyChooseTitle4} <span style={{ color: '#FFD700' }}>?!?</span>
                </h1>
              </div>

              {/* Right Features List */}
              <div className="col-lg-6 d-flex flex-column align-items-lg-end">
                <div style={{ maxWidth: '400px', width: '100%' }}>
                  {features.map((item, idx) => (
                    <div key={idx} className="feature-item-container d-flex align-items-center">
                      <div className="feature-icon-circle me-4">
                        <Image src={item.icon} alt={item.title} width={28} height={28} style={{ objectFit: 'contain' }} />
                      </div>
                      <span className="fs-4 fw-medium text-white">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      

        {/* --- REVIEWS SECTION - INCREASED WIDTH CARDS --- */}
        <section className="reviews-container">
            <div className='site-wrapper'>
          <div className="container-fluid px-lg-5 text-center">
            <h2 className="fw-bold mb-1" style={{ color: '#033564', fontSize: '32px' }}>
              {t.reviewsTitle}
            </h2>

            <div className="mx-auto mb-5" style={{ width: '60px', height: '4px', backgroundColor: '#00A8E8' }}></div>

            <div className="reviews-slider">
              {[...reviews, ...reviews].map((rev, idx) => (
                <div key={idx} className="review-slide">
                  <div className="review-card text-start">
                    
                    <div>
                      <div className="star-rating mb-2 d-flex align-items-center justify-content-between">
                        <div>
                          {[...Array(rev.rating)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill me-1"></i>
                          ))}
                        </div>

                        <span className="verified-badge">
                          <i className="bi bi-patch-check-fill text-secondary"></i> Verified
                        </span>
                      </div>

                      <h6 className="fw-bold mb-2" style={{ fontSize: '15px' }}>{rev.title}</h6>

                      <p className="text-muted small mb-0" style={{ fontSize: '12px', lineHeight: '1.6', minHeight: '60px' }}>
                        {rev.text}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                      <span className="fw-bold" style={{ fontSize: '12px' }}>{rev.name}</span>
                      <span className="text-muted" style={{ fontSize: '10px' }}>{rev.time}</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>
      </div>
      <Home4/>
    </main>
  );
};

export default TourismAndWhyChoose;