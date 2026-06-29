"use client";
import React, { useEffect } from 'react';
import { NormalizedSeat } from "./seat";

interface Step3Props {
  operatorName: string;
  selectedBp: any;
  selectedDp: any;
  doj: string;
  departureTime: string;
  arrivalTime: string;
  finalAmount: number;
  contactPhone: string;
  setContactPhone: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  contactState: string;
  setContactState: (val: string) => void;
  passengers: any[];
  handlePaxChange: (index: number, field: string, value: string) => void;
  showSuggestions: number | null;
  setShowSuggestions: (val: number | null) => void;
  savedPassengers: any[];
  insurance: boolean | null;
  setInsurance: (val: boolean | null) => void;
  hasGst: boolean;
  setHasGst: (val: boolean) => void;
  gstDetails: { name: string; gstId: string; address: string };
  setGstDetails: (val: any) => void;
  selectedSeats: NormalizedSeat[];
  busType: string;
}

export default function Step3PassengerInfo({
  operatorName, selectedBp, selectedDp, doj, departureTime, arrivalTime, finalAmount, contactPhone, setContactPhone, contactEmail, setContactEmail, contactState, setContactState,
  passengers, handlePaxChange, showSuggestions, setShowSuggestions, savedPassengers,
  insurance, setInsurance, hasGst, setHasGst, gstDetails, setGstDetails, selectedSeats, busType
}: Step3Props) {

  useEffect(() => {
    if (passengers && passengers.length > 0) {
      localStorage.setItem('localPassengerDetails', JSON.stringify(passengers));
    }
  }, [passengers]);

  useEffect(() => {
    if (contactPhone && /^(\+91\s*|91\s*)/.test(contactPhone)) {
      setContactPhone(contactPhone.replace(/^(\+91\s*|91\s*)/, ''));
    }
  }, [contactPhone, setContactPhone]);

  const figmaBoxStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e9ecef",
    borderRadius: "20px",
    padding: "32px",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
  };

  const figmaInputStyle = {
    backgroundColor: "transparent",
    border: "1px solid #777777",
    borderRadius: "8px",
    boxShadow: "none",
    color: "#111827",
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: "22px",
    padding: "12px 16px",
    width: "100%"
  };

  const figmaLabelStyle = {
    color: "#111827", 
    fontWeight: 600,
    fontSize: "18px",
    lineHeight: "28px",
    fontFamily: "'Poppins', sans-serif",
    marginBottom: "4px"
  };

  const figmaTextStyle = {
    color: "#4B5563",
    fontSize: "14px",
    fontWeight: 400,
  };

  const getFormattedDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const depMinutes = parseTimeToMinutes(departureTime);
  const arrMinutes = parseTimeToMinutes(arrivalTime);
  let durationMinutes = arrMinutes - depMinutes;
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }
  const durationHours = Math.floor(durationMinutes / 60);
  const durationMins = durationMinutes % 60;
  const journeyDuration = `${durationHours}h ${durationMins}m`;

  const isNextDayArrival = arrMinutes < depMinutes;
  const journeyDateObj = new Date(doj);
  const boardingDate = getFormattedDate(doj);
  let droppingDate = boardingDate;
  if (isNextDayArrival) {
    const nextDay = new Date(journeyDateObj);
    nextDay.setDate(journeyDateObj.getDate() + 1);
    droppingDate = getFormattedDate(nextDay.toISOString());
  }

  const boardingPointName = selectedBp?.stage || selectedBp?.locationName || selectedBp?.name || "Not Selected";
  const boardingPointTime = selectedBp?.time || selectedBp?.Time || selectedBp?.bpTime || "N/A";
  const droppingPointName = selectedDp?.stage || selectedDp?.locationName || selectedDp?.name || "Not Selected";
  const droppingPointTime = selectedDp?.time || selectedDp?.Time || selectedDp?.dpTime || "N/A";

  return (
    <div className="row g-4 w-100 mx-0 justify-content-center passenger-info-page pb-5">
      <div className="col-12 col-lg-7" style={{ gap: '16px' }}>
        <style>{`
          .form-control::placeholder {
            font-size: 15px;
            font-weight: 400;
            color: #9ca3af;
          }
          .gender-group {
            display: flex;
            gap: 16px;
          }
          .gender-option {
            flex: 1;
            text-align: center;
            padding: 8px;
            border-radius: 10px;
            border: 1px solid #D1D5DB;
            cursor: pointer;
            transition: .2s;
            font-size: 16px;
          }
          .gender-option.selected {
            background: transparent;
            color: #111827;
            border: 2px solid #0D2B4C;
            font-weight: 600;
          }
          .form-control:focus, .form-select:focus {
            color: #000;
            border-color: #0D2B4C;
            box-shadow: none;
          }
          input:not(:placeholder-shown), select:not([value=""]) {
            color: #000;
            font-weight: 500;
          }
          
          .phone-wrapper:focus-within {
            border-color: #86b7fe !important;
            outline: 0;
            box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
          }

          .verify-btn {
            min-width: 140px;
          }
          
          /* Aligned inputs globally */
          .age-input-container {
            width: 140px;
          }

          @media (max-width: 768px) {
            .passenger-info-page [style*="padding: 32px"] {
               padding: 24px 16px !important;
            }
            .passenger-info-page [style*="padding: 24px 32px"] {
               padding: 20px 16px !important;
            }
            .contact-row, .passenger-row, .offer-row {
               flex-direction: column !important;
            }
            .age-input-container {
               width: 100% !important;
            }
            .verify-btn {
               width: 100% !important;
            }
          }
        `}</style>
        
        {/* CONTACT DETAILS */}
        <div style={{...figmaBoxStyle, borderRadius: '24px'}} className="mb-4">
          <h5 style={figmaLabelStyle}>Contact Details</h5>
          <p style={{...figmaTextStyle, fontSize: '13px', lineHeight: '20px'}} className="mb-4">Your ticket confirmation will be sent to the details below.</p>
          <div className="contact-details">
            <div className="contact-row d-flex flex-column flex-md-row gap-3 mb-3 w-100">
              <div className="phone-wrapper d-flex align-items-stretch flex-grow-1" style={{ 
                ...figmaInputStyle, 
                padding: 0, 
                overflow: 'hidden',
                backgroundColor: 'transparent'
              }}>
                <span className="country-code d-flex align-items-center" style={{ 
                  padding: '0 8px 0 16px', 
                  color: '#4B5563', 
                  fontSize: '15px', 
                  fontWeight: 500, 
                  whiteSpace: 'nowrap',
                  flex: '0 0 auto'
                }}>
                  +91
                </span>
                <input 
                  type="tel" 
                  className="shadow-none border-0 m-0 w-100" 
                  placeholder="Phone Number *" 
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={contactPhone?.replace(/^(\+91\s*|91\s*)/, '') || ''} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setContactPhone(value.slice(0, 10));
                  }} 
                  style={{
                    backgroundColor: 'transparent',
                    color: '#000',
                    fontSize: '15px',
                    padding: '12px 16px 12px 4px',
                    outline: 'none',
                    minWidth: 0
                  }}
                />
              </div>

              <input 
                type="email" 
                className="form-control shadow-none m-0 flex-grow-1" 
                placeholder="Email Address" 
                value={contactEmail} 
                onChange={(e) => setContactEmail(e.target.value)} 
                style={figmaInputStyle} 
              />
            </div>
            
            <div className="form-group mb-2 w-100">
              <select className="form-select shadow-none w-100" value={contactState} onChange={(e) => setContactState(e.target.value)} style={{...figmaInputStyle, color: contactState ? "#000" : "#676767"}}>
                <option value="">State of Residence *</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <div className="mt-2">
              <span style={{ fontSize: "13px", fontWeight: 400, color: "#676767" }}>Required only if you need a GST invoice.</span>
            </div>
          </div>
        </div>

        {/* PASSENGER DETAILS */}
        <div style={{...figmaBoxStyle, borderRadius: '24px'}} className="mb-4">
          <h5 style={figmaLabelStyle}>Passenger Details</h5>
          {passengers.map((pax, index) => {
            const filteredSuggestions = pax.name
              ? savedPassengers
                  .filter(sp => sp.name.toLowerCase().includes(pax.name.toLowerCase()))
                  .slice(0, 5)
              : [];

            return (
              <div key={pax.seatId} className={`passenger-details w-100 ${index !== passengers.length - 1 ? "mb-4 pb-4 border-bottom" : ""}`}>
                <p className="mb-3" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280' }}>Seat {pax.seatId}</p>
                
                <div className="passenger-row d-flex flex-column flex-md-row gap-3 mb-3 w-100">
                  <div className="position-relative m-0 flex-grow-1">
                    <input 
                      type="text" 
                      className="form-control shadow-none w-100" 
                      placeholder="Full Name *" 
                      value={pax.name} 
                      onChange={(e) => handlePaxChange(index, 'name', e.target.value)} 
                      onFocus={() => setShowSuggestions(index)}
                      onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
                      style={figmaInputStyle} 
                    />
                    {showSuggestions === index && filteredSuggestions.length > 0 && (
                      <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 10, top: '100%', left: 0, maxHeight: '200px', overflowY: 'auto', marginTop: '4px' }}>
                        {filteredSuggestions.map((sp, spIdx) => (
                          <div
                            key={spIdx}
                            className="p-3 border-bottom d-flex flex-column"
                            style={{ cursor: 'pointer', fontSize: '15px', fontWeight: 500, lineHeight: '1.4' }}
                            onMouseDown={() => {
                              handlePaxChange(index, 'name', sp.name);
                              handlePaxChange(index, 'age', sp.age);
                              handlePaxChange(index, 'gender', sp.gender);
                              setShowSuggestions(null);
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <div className="fw-bold text-dark">{sp.name}</div>
                            <div className="text-muted" style={{ fontSize: '13px', lineHeight: '18px' }}>{sp.age} yrs • {sp.gender}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="age-input-container m-0 flex-shrink-0">
                    <input 
                      type="number" 
                      className="form-control shadow-none w-100" 
                      placeholder="Age *" 
                      value={pax.age} 
                      min={1}
                      max={120}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          handlePaxChange(index, 'age', "");
                        } else {
                          handlePaxChange(index, 'age', value);
                        }
                      }} style={figmaInputStyle} />
                  </div>
                </div>

                <div className="form-group w-100">
                  <span style={{ fontSize: "16px", fontWeight: 500, lineHeight: "22px", color: "#676767" }}>Gender *</span>
                  <div className="gender-group mt-2">
                    <label className={`gender-option ${pax.gender === 'Male' ? 'selected' : ''}`}>
                      <input type="radio" className="d-none" name={`gender-${index}`} value="Male" onChange={() => handlePaxChange(index, 'gender', 'Male')} /> 
                      Male
                    </label>
                    <label className={`gender-option ${pax.gender === 'Female' ? 'selected' : ''}`}>
                      <input type="radio" className="d-none" name={`gender-${index}`} value="Female" onChange={() => handlePaxChange(index, 'gender', 'Female')} /> 
                      Female
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* OFFERS & COUPONS */}
        <div style={{...figmaBoxStyle, borderRadius: '24px'}} className="mb-4 w-100">
          <div className="d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-tag fs-5" style={{color: "#111827"}}></i>
            <h5 style={figmaLabelStyle} className="text-dark mb-0">Offers & Coupons</h5>
          </div>
          <div className="mt-3">
            <div className="offer-row d-flex flex-column flex-md-row gap-3 mb-3 w-100">
              <input type="text" className="form-control shadow-none flex-grow-1 m-0" placeholder="Enter Membership Code" style={figmaInputStyle} />
              <button type="button" className="btn btn-primary verify-btn m-0 flex-shrink-0" style={{ padding: '12px 16px', fontSize: '14px', borderRadius: '8px' }}>Verify</button>
            </div>
            
            <div className="offer-row d-flex flex-column flex-md-row gap-3 w-100">
              <input type="text" className="form-control shadow-none flex-grow-1 m-0" placeholder="Enter Offer Code" style={figmaInputStyle} />
              <button type="button" className="btn btn-primary verify-btn m-0 flex-shrink-0" style={{ padding: '12px 16px', fontSize: '14px', borderRadius: '8px' }}>Verify</button>
            </div>
          </div>
        </div>

        {/* TRAVEL INSURANCE */}
        <div style={{...figmaBoxStyle, borderRadius: '24px'}} className="mb-4">
          <h5 style={figmaLabelStyle}>Travel Insurance</h5>
          <p style={{...figmaTextStyle, fontSize: '14px'}} className="mb-4">Protect your trip for just ₹15 per passenger.</p>
          <div className="mb-4">
            <div className="mb-3">
              <p className="mb-0 text-dark" style={{ fontSize: "15px", fontWeight: 600, lineHeight: "22px" }}>Up to ₹5,000</p>
              <p className="mb-0" style={{ fontSize: "13px", lineHeight: "18px", color: "#676767" }}>Loss of luggage</p>
            </div>
          </div>
          <div className="d-flex flex-column gap-3">
            <label className="p-3 d-flex align-items-center gap-3 cursor-pointer" style={{ backgroundColor: "transparent", border: insurance === true ? '1px solid #333' : '1px solid #777777', borderRadius: "20px" }}>
              <input type="radio" name="insurance" checked={insurance === true} onChange={() => setInsurance(true)} style={{ width: "16px", height: "16px" }} />
              <span style={{ fontSize: "14px", fontWeight: 400, color: "#333" }}>Yes, protect my trip for ₹15 per passenger.</span>
            </label>
            <label className="p-3 d-flex align-items-center gap-3 cursor-pointer" style={{ backgroundColor: "transparent", border: insurance === false ? '1px solid #333' : '1px solid #777777', borderRadius: "20px" }}>
              <input type="radio" name="insurance" checked={insurance === false} onChange={() => setInsurance(false)} style={{ width: "16px", height: "16px" }} />
              <span style={{ fontSize: "14px", fontWeight: 400, color: "#333" }}>No, continue without insurance.</span>
            </label>
          </div>
        </div>

        {/* GST DETAILS */}
        <div style={{ ...figmaBoxStyle, padding: "24px 32px", borderRadius: '24px' }} className="mb-4">
          <div className="d-flex align-items-start gap-3">
            <input type="checkbox" id="gstCheck" checked={hasGst} onChange={(e) => setHasGst(e.target.checked)} style={{ width: "20px", height: "20px", cursor: "pointer", marginTop: "3px" }} />
            <div>
              <label htmlFor="gstCheck" style={{ ...figmaLabelStyle, margin: 0, cursor: "pointer" }}>Add GST Details</label>
              <div style={{ fontSize: '13px', lineHeight: "18px", fontWeight: 400, color: '#888', marginTop: '2px' }}>(Optional)</div>
            </div>
          </div>
          {hasGst && (
            <div className="row g-3 mt-3 w-100 m-0">
              <div className="col-12 col-md-6 px-0 pe-md-2"><input type="text" className="form-control shadow-none w-100" placeholder="Company Name" value={gstDetails.name} onChange={e => setGstDetails({...gstDetails, name: e.target.value})} style={figmaInputStyle} /></div>
              <div className="col-12 col-md-6 px-0 ps-md-2"><input type="text" className="form-control shadow-none w-100" placeholder="GST Number" value={gstDetails.gstId} onChange={e => setGstDetails({...gstDetails, gstId: e.target.value})} style={figmaInputStyle} /></div>
              <div className="col-12 px-0"><input type="text" className="form-control shadow-none w-100" placeholder="Company Address" value={gstDetails.address} onChange={e => setGstDetails({...gstDetails, address: e.target.value})} style={figmaInputStyle} /></div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR (SUMMARY) */}
      <div className="col-12 col-lg-5">
        <div className="sticky-top" style={{ ...figmaBoxStyle, top: "24px", padding: "24px 24px", zIndex: 10 }}>
          <div className="mb-3">
            <h5 style={{...figmaLabelStyle, fontSize: '18px', fontWeight: 600}}>{operatorName}</h5>
            <p style={{...figmaTextStyle, fontSize: '14px', fontWeight: 400}} className="mb-0">{selectedSeats.length} Seat • {busType}</p>
          </div>

          {/* OVERLAPPING FIX: Defined Timeline Tracks */}
          <div className="d-flex gap-3 position-relative align-items-stretch">
            <div className="d-flex flex-column align-items-center position-relative" style={{ minWidth: '16px' }}>
              <div className="timeline-dot" style={{width: '12px', height: '12px', backgroundColor: '#111827', borderRadius: '50%', zIndex: 2, marginTop: '8px'}}></div>
              <div className="timeline-line" style={{position: 'absolute', top: '14px', bottom: '14px', width: '2px', backgroundColor: '#e9ecef', zIndex: 1}}></div>
              <div className="timeline-dot" style={{width: '12px', height: '12px', backgroundColor: '#111827', borderRadius: '50%', zIndex: 2, marginBottom: '8px', marginTop: 'auto'}}></div>
            </div>
            
            <div className="d-flex flex-column justify-content-between w-100 gap-3">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{boardingPointTime}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{boardingDate}</div>
                </div>
                <div className="text-end" style={{ maxWidth: '65%' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', wordBreak: 'break-word' }}>{boardingPointName}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Pickup Van/Bus</div>
                </div>
              </div>
              
              <div className="text-muted my-1" style={{ fontSize: '13px', paddingLeft: '2px' }}>{journeyDuration}</div>
              
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{droppingPointTime}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{droppingDate}</div>
                </div>
                <div className="text-end" style={{ maxWidth: '65%' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', wordBreak: 'break-word' }}>{droppingPointName}</div>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "#777777", opacity: 0.2, margin: "16px 0" }} />

          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{...figmaTextStyle, fontWeight: 500, color: '#676767', fontSize: '14px'}}>Seat Details</span>
            <span className="text-end" style={{...figmaTextStyle, fontWeight: 600, color: '#333', fontSize: '14px'}}>{selectedSeats.map(s => `${s.id} • ${s.isUpper ? 'Upper' : 'Lower'} Deck`).join(', ')}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span style={{...figmaTextStyle, fontWeight: 500, color: '#676767', fontSize: '14px'}}>Passenger</span>
            <span className="text-end" style={{...figmaTextStyle, fontWeight: 600, color: '#333', fontSize: '14px'}}>{selectedSeats.length} Passenger{selectedSeats.length > 1 ? 's' : ''}</span>
          </div>

          <hr style={{ borderColor: "#777777", opacity: 0.2, margin: "16px 0" }} />
          <div className="d-flex justify-content-between align-items-center">
            <h6 style={{...figmaLabelStyle, fontSize: '16px', fontWeight: 600, marginBottom: 0}}>Fare</h6>
            <p style={{...figmaTextStyle, fontSize: '20px', fontWeight: 700, color: '#333'}} className="mb-0">₹{finalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}