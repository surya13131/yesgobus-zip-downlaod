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

  // ✅ FIX: Save passenger details to localStorage so CheckoutPage can read Age & Gender
  useEffect(() => {
    if (passengers && passengers.length > 0) {
      localStorage.setItem('localPassengerDetails', JSON.stringify(passengers));
    }
  }, [passengers]);

  // ✅ FIX: Forcefully clean auto-filled or initial phone numbers containing +91 or 91
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
    color: "#333",
    fontSize: "15px",
    fontWeight: 400,
    lineHeight: "22px",
    padding: "12px 16px",
  };

  const figmaLabelStyle = {
    color: "#111827", 
    fontWeight: 600,
    fontSize: "18px", // Section Heading
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
    if (!timeStr) return 0; // ✅ FIX: Prevent crash if time string is undefined
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
    durationMinutes += 24 * 60; // Add a day if arrival is on the next day
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
    <div className="row g-4 w-100 mx-0 justify-content-center">
      <div className="col-12 col-lg-6">
      <style>{`
        .form-control::placeholder {
          font-size: 15px;
          font-weight: 400;
        }
      `}</style>
        <div style={figmaBoxStyle} className="mb-4">
          <h5 style={figmaLabelStyle}>Contact Details</h5>
          <p style={{...figmaTextStyle, fontSize: '13px', lineHeight: '20px'}} className="mb-4">Your ticket confirmation will be sent to the details below.</p>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text fw-medium" style={{ backgroundColor: "transparent", border: "1px solid #777777", borderRight: "none", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px", color: "#333", fontSize: "14px" }}>+91 (IND)</span>
                {/* ✅ FIX: Force value to strip double +91 visually and on typing */}
                <input 
                  type="tel" 
                  className="form-control shadow-none" 
                  placeholder="Phone Number *" 
                  value={contactPhone?.replace(/^(\+91\s*|91\s*)/, '') || ''} 
                  onChange={(e) => {
                    const cleanedPhone = e.target.value.replace(/^(\+91\s*|91\s*)/, '');
                    setContactPhone(cleanedPhone);
                  }} 
                  style={{ backgroundColor: "transparent", border: "1px solid #777777", borderLeft: "none", borderTopRightRadius: "8px", borderBottomRightRadius: "8px", fontSize: "14px", color: "#333", paddingLeft: "0" }} 
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <input type="email" className="form-control shadow-none" placeholder="Email Address" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} style={figmaInputStyle} />
            </div>
            <div className="col-12">
              <select className="form-select shadow-none" value={contactState} onChange={(e) => setContactState(e.target.value)} style={{...figmaInputStyle, color: contactState ? "#333" : "#676767"}}>
                <option value="">State of Residence *</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <div className="col-12 mt-2">
              <span style={{ fontSize: "13px", fontWeight: 400, color: "#676767" }}>Required only if you need a GST invoice.</span>
            </div>
          </div>
        </div>

        <div style={figmaBoxStyle} className="mb-4">
          <h5 style={figmaLabelStyle}>Passenger Details</h5>
          {passengers.map((pax, index) => {
            
            const filteredSuggestions = pax.name
              ? savedPassengers
                  .filter(sp => sp.name.toLowerCase().includes(pax.name.toLowerCase()))
                  .slice(0, 5)
              : [];

            return (
              <div key={pax.seatId} className={index !== passengers.length - 1 ? "mb-4 pb-4 border-bottom" : ""}>
                <p className="mb-3" style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280' }}>Seat {pax.seatId}</p>
                
                <div className="row g-3 mb-3">
                  <div className="col-12 position-relative">
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
                  <div className="col-12">
                    <input type="number" className="form-control shadow-none w-100" placeholder="Age *" value={pax.age} onChange={(e) => handlePaxChange(index, 'age', e.target.value)} style={figmaInputStyle} />
                  </div>
                </div>
                <div className="d-flex flex-column gap-2 mt-2">
                  <span style={{ fontSize: "15px", fontWeight: 500, lineHeight: "22px", color: "#676767" }}>Gender *</span>
                  <div className="d-flex gap-3 w-100">
                    <label className="btn py-2 text-center" style={{ flex: 1, border: pax.gender === 'Male' ? '1px solid #333' : '1px solid #777777', backgroundColor: "transparent", color: pax.gender === 'Male' ? '#000' : '#676767', borderRadius: "8px", fontSize: "15px", fontWeight: 500, letterSpacing: "0.2px", cursor: "pointer" }}>
                      <input type="radio" className="d-none" name={`gender-${index}`} value="Male" onChange={() => handlePaxChange(index, 'gender', 'Male')} /> 
                      Male
                    </label>
                    <label className="btn py-2 text-center" style={{ flex: 1, border: pax.gender === 'Female' ? '1px solid #333' : '1px solid #777777', backgroundColor: "transparent", color: pax.gender === 'Female' ? '#000' : '#676767', borderRadius: "8px", fontSize: "15px", fontWeight: 500, letterSpacing: "0.2px", cursor: "pointer" }}>
                      <input type="radio" className="d-none" name={`gender-${index}`} value="Female" onChange={() => handlePaxChange(index, 'gender', 'Female')} /> 
                      Female
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={figmaBoxStyle} className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-tag fs-5" style={{color: "#111827"}}></i>
            <h5 style={figmaLabelStyle} className="text-dark mb-0">Offers & Coupons</h5>
          </div>
          <div className="row g-3 mt-2">
            <div className="col-12 d-flex gap-2 align-items-center">
              <input type="text" className="form-control shadow-none" placeholder="Enter Membership Code" style={figmaInputStyle} />
              <button type="button" style={{ background: "#1DA1F2", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "20px", fontSize: "14px", fontWeight: "500" }}>Verify</button>
            </div>
            <div className="col-12 d-flex gap-2 align-items-center">
              <input type="text" className="form-control shadow-none" placeholder="Enter Offer Code" style={figmaInputStyle} />
              <button type="button" style={{ background: "#1DA1F2", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "20px", fontSize: "14px", fontWeight: "500" }}>Verify</button>
            </div>
          </div>
        </div>

        <div style={figmaBoxStyle} className="mb-4">
          <h5 style={figmaLabelStyle}>Travel Insurance</h5>
          <p style={{...figmaTextStyle, fontSize: '14px'}} className="mb-4">Protect your trip for just ₹15 per passenger.</p>
          <div className="mb-4">
            <div className="mb-3">
              <p className="mb-0 text-dark" style={{ fontSize: "15px", fontWeight: 600, lineHeight: "22px" }}>Up to ₹5,000</p>
              <p className="mb-0" style={{ fontSize: "13px", lineHeight: "18px", color: "#676767" }}>Loss of luggage</p>
            </div>
            <div className="mb-3">
              <p className="mb-0 text-dark" style={{ fontSize: "15px", fontWeight: 600, lineHeight: "22px" }}>Up to ₹5,000</p>
              <p className="mb-0" style={{ fontSize: "13px", lineHeight: "18px", color: "#676767" }}>Loss of luggage</p>
            </div>
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

        <div style={{ ...figmaBoxStyle, padding: "24px 32px" }}>
          <div className="d-flex align-items-start gap-3">
            <input type="checkbox" id="gstCheck" checked={hasGst} onChange={(e) => setHasGst(e.target.checked)} style={{ width: "20px", height: "20px", cursor: "pointer", marginTop: "3px" }} />
            <div>
              <label htmlFor="gstCheck" style={{ ...figmaLabelStyle, margin: 0, cursor: "pointer" }}>Add GST Details</label>
              <div style={{ fontSize: '13px', lineHeight: "18px", fontWeight: 400, color: '#888', marginTop: '2px' }}>(Optional)</div>
            </div>
          </div>
          {hasGst && (
            <div className="row g-3 mt-3">
              <div className="col-12 col-md-6"><input type="text" className="form-control shadow-none" placeholder="Company Name" value={gstDetails.name} onChange={e => setGstDetails({...gstDetails, name: e.target.value})} style={figmaInputStyle} /></div>
              <div className="col-12 col-md-6"><input type="text" className="form-control shadow-none" placeholder="GST Number" value={gstDetails.gstId} onChange={e => setGstDetails({...gstDetails, gstId: e.target.value})} style={figmaInputStyle} /></div>
              <div className="col-12"><input type="text" className="form-control shadow-none" placeholder="Company Address" value={gstDetails.address} onChange={e => setGstDetails({...gstDetails, address: e.target.value})} style={figmaInputStyle} /></div>
            </div>
          )}
        </div>
      </div>

      <div className="col-12 col-lg-6">
        <div className="sticky-top" style={{ ...figmaBoxStyle, top: "100px", padding: "40px 30px" }}>
          <div className="mb-5">
            <h5 style={{...figmaLabelStyle, fontSize: '18px', fontWeight: 600}}>{operatorName}</h5>
            <p style={{...figmaTextStyle, fontSize: '14px', fontWeight: 400}} className="mb-0">{selectedSeats.length} Seat • {busType}</p>
          </div>

          {/* Journey Timeline */}
          <div className="d-flex gap-4">
            <div className="d-flex flex-column align-items-center">
              <div className="timeline-dot"></div>
              <div className="timeline-line"></div>
              <div className="timeline-dot"></div>
            </div>
            <div className="d-flex flex-column justify-content-between w-100">
              <div className="d-flex justify-content-between">
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 700, color: '#111827' }}>{boardingPointTime}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>{boardingDate}</div>
                </div>
                <div className="text-end">
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{boardingPointName}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>Pickup Van/Bus</div>
                </div>
              </div>
              <div className="text-muted my-3" style={{ fontSize: '13px' }}>{journeyDuration}</div>
              <div className="d-flex justify-content-between">
                <div>
                  <div style={{ fontSize: '26px', fontWeight: 700, color: '#111827' }}>{droppingPointTime}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>{droppingDate}</div>
                </div>
                <div className="text-end">
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{droppingPointName}</div>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: "#777777", opacity: 0.4, margin: "30px 0" }} />

          {/* Seat & Passenger Details */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{...figmaTextStyle, fontWeight: 500, color: '#676767', fontSize: '14px'}}>Seat Details</span>
            <span className="text-end" style={{...figmaTextStyle, fontWeight: 600, color: '#333', fontSize: '14px'}}>{selectedSeats.map(s => `${s.id} • ${s.isUpper ? 'Upper' : 'Lower'} Deck`).join(', ')}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span style={{...figmaTextStyle, fontWeight: 500, color: '#676767', fontSize: '14px'}}>Passenger</span>
            <span className="text-end" style={{...figmaTextStyle, fontWeight: 600, color: '#333', fontSize: '14px'}}>{selectedSeats.length} Passenger{selectedSeats.length > 1 ? 's' : ''}</span>
          </div>

          <hr style={{ borderColor: "#777777", opacity: 0.4, margin: "30px 0" }} />
          <div className="d-flex justify-content-between align-items-center">
            <h6 style={{...figmaLabelStyle, fontSize: '16px', fontWeight: 600, marginBottom: 0}}>Fare</h6>
            <p style={{...figmaTextStyle, fontSize: '20px', fontWeight: 700, color: '#333'}} className="mb-0">₹{finalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}