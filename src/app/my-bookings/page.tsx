"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "../components/api";

interface Booking {
  id?: string;
  _id?: string; 
  pnr: string;
  blockKey?: string; 
  apiProvider: string; 
  operatorName: string;
  busType: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  seatNumbers: string[] | string | any;
  passengerName: string;
  totalFare: number;
  status: "upcoming" | "completed" | "cancelled" | "paid" | "success" | "CANCELLED";
  bookingDate: string;
  boardingPoint: string;
  droppingPoint: string;
}

interface CancelPreview {
  bookingId: string;
  apiProvider: string;
  cca: string;
  ctpc: string;
  refundAmount: number;
  pnr?: string; 
  blockKey?: string; 
  seatNumbers?: string; 
}


const EmptyState = ({ onRefresh, refreshing }: { onRefresh: () => void; refreshing: boolean }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 w-100 rounded-4 shadow-sm mx-auto" style={{ minHeight: "50vh", maxWidth: "600px", backgroundColor: "#fff", border: "1px solid #eaeaea" }}>
    <div className="mb-3" style={{ background: "#f8f9fa", padding: "20px", borderRadius: "50%" }}>
      <i className="bi bi-journal-x" style={{ fontSize: "40px", color: "#adb5bd" }}></i>
    </div>
    <p style={{ fontSize: "16px", fontWeight: "500", color: "#6c757d", marginBottom: "20px" }}>
      No bookings found.
    </p>
    <button
      onClick={onRefresh}
      className="btn d-inline-flex align-items-center gap-2 px-4 py-2 custom-hover-btn"
      style={{
        backgroundColor: "#0D2B4C",
        color: "#fff",
        borderRadius: "50px",
        fontSize: "14px",
        fontWeight: "500",
        border: "none",
        boxShadow: "0px 4px 12px rgba(13, 43, 76, 0.2)",
        transition: "all 0.3s ease"
      }}
    >
      <i className={`bi bi-arrow-clockwise ${refreshing ? "spin-icon" : ""}`}></i>
      Refresh
    </button>
  </div>
);

const BookingCard = ({
  booking,
  onClick
}: {
  booking: Booking;
  onClick: (b: Booking) => void;
}) => {
  return (
    <div
      className="card border-0 mb-3 booking-card w-100"
      onClick={() => onClick(booking)}
      style={{
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        border: "1px solid #edf2f7",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease"
      }}
    >
      <div className="card-body p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between w-100 flex-wrap gap-3">
          <div className="d-flex flex-row align-items-start gap-3 gap-md-4 flex-grow-1">
            <div className="mt-1 d-none d-sm-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "50px", height: "50px", backgroundColor: "#f0f4f8", borderRadius: "50%" }}>
              <i className="bi bi-bus-front" style={{ color: "#0D2B4C", fontSize: "22px" }}></i>
            </div>
            <div className="flex-grow-1">
              <h5 className="mb-2 d-flex flex-wrap align-items-center gap-2" style={{ color: "#0D2B4C", fontWeight: "700", fontSize: "18px" }}>
                <span>{booking.from || (booking as any).sourceCity}</span> 
                <div className="d-flex align-items-center justify-content-center mx-1 flex-shrink-0" style={{ width: "22px", height: "22px", backgroundColor: "#f8f9fa", borderRadius: "50%" }}>
                  <i className="bi bi-arrow-right" style={{ fontSize: "12px", color: "#6c757d" }}></i>
                </div>
                <span>{booking.to || (booking as any).destinationCity}</span>
              </h5>
              <div className="d-flex flex-wrap gap-3 mt-2" style={{ fontSize: "13px", color: "#495057", fontWeight: "500" }}>
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-calendar3 text-muted"></i> 
                  {booking.departureDate || (booking as any).doj?.split('T')}
                </div>
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-clock text-muted"></i>
                  {booking.departureTime || (booking as any).pickUpTime} 
                  <i className="bi bi-arrow-right mx-1" style={{ fontSize: "10px", color: "#adb5bd" }}></i> 
                  {booking.arrivalTime || (booking as any).reachTime}
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center flex-wrap gap-2" style={{ fontSize: "13px", color: "#6c757d", fontWeight: "500" }}>
                <i className="bi bi-building"></i>
                <span className="text-truncate" style={{ maxWidth: "200px" }}>{booking.operatorName || (booking as any).busOperator}</span> 
                <span className="badge rounded-pill flex-shrink-0" style={{ backgroundColor: "#e2e8f0", color: "#475569", fontSize: "10px", fontWeight: "600", letterSpacing: "0.5px" }}>
                  {booking.apiProvider || ((booking as any).isVrl ? "VRL" : (booking as any).isSrs ? "SRS" : "EZEE")}
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end justify-content-center mt-2 mt-sm-0 w-100 w-sm-auto">
            <div className="d-flex align-items-center justify-content-between w-100 w-sm-auto mb-2 gap-3">
              <span 
                className="badge rounded-pill px-3 py-2 shadow-sm" 
                style={{ 
                  backgroundColor: (booking.status?.toLowerCase() === 'cancelled' || (booking as any).bookingStatus?.toLowerCase() === 'cancelled') ? '#fee2e2' : '#dcfce7',
                  color: (booking.status?.toLowerCase() === 'cancelled' || (booking as any).bookingStatus?.toLowerCase() === 'cancelled') ? '#dc2626' : '#16a34a',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: "0.5px"
                }}
              >
                <i className={`bi ${(booking.status?.toLowerCase() === 'cancelled' || (booking as any).bookingStatus?.toLowerCase() === 'cancelled') ? 'bi-x-circle-fill' : 'bi-check-circle-fill'} me-1`}></i>
                {(booking.status || (booking as any).bookingStatus || 'UPCOMING').toUpperCase()}
              </span>
            </div>
            {(booking.status?.toLowerCase() === 'cancelled' || (booking as any).bookingStatus?.toLowerCase() === 'cancelled') && (booking as any).totalRefundAmount > 0 &&
              <div className="text-success mt-1 mb-2 text-end w-100" style={{ fontSize: '12px', fontWeight: '600' }}>
                Refund: ₹{(booking as any).totalRefundAmount}
              </div>
            }
            <div className="text-primary view-details-text text-end w-100" style={{ fontSize: "13px", fontWeight: "600" }}>
              View Details <i className="bi bi-chevron-right fs-6 align-middle"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Popup Modal (with Cancel & Refund Logic) ────────────────────────────────
const TicketModal = ({ 
  booking, 
  onClose, 
  onInitiateCancel,
  isProcessing
}: { 
  booking: Booking | null, 
  onClose: () => void, 
  onInitiateCancel: (b: Booking) => void,
  isProcessing: boolean
}) => {
  const router = useRouter();

  if (!booking) return null;

  const currentStatus = booking.status?.toLowerCase() || (booking as any).bookingStatus?.toLowerCase();
  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'cancel';
  const bookingId = booking.id || booking._id || "";


  let displaySeats = "---";
  const rawSeats = booking.seatNumbers || (booking as any).selectedSeats || (booking as any).seats || [];
  if (typeof rawSeats === 'string') {
    displaySeats = rawSeats;
  } else if (Array.isArray(rawSeats)) {
    displaySeats = rawSeats.map((p: any) => typeof p === 'string' ? p : (p?.seatName || p?.seatCode)).filter(Boolean).join(", ");
  }

  const handleViewTicket = () => {
  
    const normalizedBookingData = {
        ...booking,
        status: isCancelled ? 'CANCELLED' : 'paid',
        bookingStatus: isCancelled ? 'cancelled' : 'paid',
        sourceCity: booking.from || (booking as any).sourceCity,
        destinationCity: booking.to || (booking as any).destinationCity,
        doj: booking.departureDate || (booking as any).doj?.split('T'),
        pickUpTime: booking.departureTime || (booking as any).pickUpTime,
        reachTime: booking.arrivalTime || (booking as any).reachTime,
        busOperator: booking.operatorName || (booking as any).busOperator,
        customerName: booking.passengerName || (booking as any).customerName,
        totalAmount: booking.totalFare || (booking as any).totalAmount || 0,
        selectedSeats: displaySeats,
        pnrNumber: booking.pnr || (booking as any).pnrNumber || booking.blockKey
    };

    // Save heavily normalized data to session storage so checkout page reads it perfectly
    sessionStorage.setItem("savedTicketData", JSON.stringify(normalizedBookingData));
    localStorage.setItem("savedTicketData", JSON.stringify(normalizedBookingData));
    
    // Force checkout page to bypass Razorpay payment initialization
    sessionStorage.setItem(`payment_success_${bookingId}`, "true");
    
    // Determine blockKey for the URL
    const bKey = booking.blockKey || booking.pnr || (booking as any).pnrNumber || "";
    const amount = booking.totalFare || (booking as any).totalAmount || 0;
    const userId = (booking as any).userId || "";
    
    window.location.href = `/checkout?bookingId=${bookingId}&blockKey=${bKey}&amount=${amount}&userId=${userId}`;
  };

  return (
    <div className="modal-overlay p-2 p-md-4" onClick={onClose}>
      <div className="custom-modal slide-up p-3 p-md-4" onClick={(e) => e.stopPropagation()}>
        
        {/* Header & Close Button */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1 text-center mt-1">
            <h3 className="modal-route-title d-flex align-items-center justify-content-center flex-wrap gap-2" style={{ color: "#0D2B4C", fontWeight: "800", marginBottom: "6px" }}>
              <span>{booking.from || (booking as any).sourceCity}</span>
              <div className="d-flex align-items-center justify-content-center bg-light rounded-circle flex-shrink-0" style={{ width: "26px", height: "26px" }}>
                <i className="bi bi-arrow-right text-muted" style={{ fontSize: "14px" }}></i>
              </div>
              <span>{booking.to || (booking as any).destinationCity}</span>
            </h3>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ backgroundColor: "#f0f4f8", color: "#0D2B4C", fontWeight: "600", fontSize: "13px" }}>
              <i className="bi bi-calendar-event"></i>
              {booking.departureDate || (booking as any).doj?.split('T')[0]}
            </div>
          </div>
          <button className="btn btn-sm btn-light rounded-circle shadow-sm flex-shrink-0 ms-2" style={{ width: "32px", height: "32px", padding: 0 }} onClick={onClose}>
            <i className="bi bi-x-lg text-secondary"></i>
          </button>
        </div>
        
        <hr style={{ borderColor: "#edf2f7", margin: "16px 0", borderTopWidth: "2px" }} />

        {/* Body */}
        <div className="text-center mb-3" style={{ color: "#334155" }}>
          <div className="d-flex justify-content-center align-items-center gap-2 gap-md-3 mb-2 fw-bold fs-6 fs-md-5">
            <span>{booking.departureTime || (booking as any).pickUpTime}</span>
            <span style={{ fontSize: "10px", color: "#94a3b8" }}>──────</span>
            <i className="bi bi-clock-history" style={{ color: "#00AEEF" }}></i>
            <span style={{ fontSize: "10px", color: "#94a3b8" }}>──────</span>
            <span>{booking.arrivalTime || (booking as any).reachTime}</span>
          </div>
          
          <div className="mb-1 fs-6 fw-bold text-break" style={{ color: "#0D2B4C" }}>{booking.operatorName || (booking as any).busOperator}</div>
          <div className="mb-3 text-muted" style={{ fontSize: '12px', fontWeight: "500" }}>{booking.busType}</div>
          
          {/* COMPACT DEVICE-RESPONSIVE CARD FOR PNR, SEATS, PASSENGER */}
          <div className="mt-3 p-3 rounded-4 text-start shadow-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
            
            {/* PNR Row */}
            <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center border-bottom pb-2 mb-2" style={{ borderColor: "#edf2f7" }}>
              <div className="text-muted mb-1 mb-sm-0" style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.5px" }}>PNR / Ticket No</div>
              <div className="fw-bold text-break text-sm-end" style={{ color: "#1e293b", fontSize: "14px", wordBreak: "break-all" }}>
                {booking.pnr || booking.blockKey || (booking as any).pnrNumber}
              </div>
            </div>
            
            {/* Seats Row */}
            <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center border-bottom pb-2 mb-2" style={{ borderColor: "#edf2f7" }}>
              <div className="text-muted mb-1 mb-sm-0" style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.5px" }}>Seats</div>
              <div className="fw-bold text-break text-sm-end" style={{ color: "#1e293b", fontSize: "14px", wordBreak: "break-word", maxWidth: "100%" }}>
                {displaySeats}
              </div>
            </div>
            
            {/* Passenger Row */}
            <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center border-bottom pb-2 mb-2" style={{ borderColor: "#edf2f7" }}>
              <div className="text-muted mb-1 mb-sm-0" style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.5px" }}>Passenger</div>
              <div className="fw-bold text-break text-sm-end" style={{ color: "#1e293b", fontSize: "14px", wordBreak: "break-word" }}>
                {booking.passengerName || (booking as any).customerName}
              </div>
            </div>
            
            {/* Status Row */}
            <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center pt-1">
              <div className="text-muted mb-2 mb-sm-0" style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.5px" }}>Status</div>
              <div className="text-sm-end">
                <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: isCancelled ? '#fee2e2' : '#dcfce7', color: isCancelled ? '#dc2626' : '#16a34a', fontWeight: "700", fontSize: "11px" }}>
                  {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-2 gap-md-3 justify-content-center mt-3">
          <button 
            className="btn py-2 py-md-3 flex-grow-1 custom-hover-btn" 
            onClick={handleViewTicket}
            style={{ backgroundColor: "#0D2B4C", color: "#fff", borderRadius: "12px", fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 12px rgba(13, 43, 76, 0.15)", border: "none" }}
          >
            <i className="bi bi-ticket-detailed me-2"></i> View Ticket
          </button>

          {!isCancelled &&
            <button
              className="btn py-2 py-md-3 flex-grow-1 custom-danger-btn"
              onClick={() => onInitiateCancel(booking)}
              disabled={isProcessing}
              style={{ backgroundColor: "#fff", color: "#ef4444", borderRadius: "12px", fontSize: "14px", fontWeight: "600", border: "2px solid #fee2e2", transition: "all 0.2s ease" }}
            >
              {isProcessing ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-x-circle me-2"></i> Cancel Ticket</>}
            </button>}
        </div>
      </div>
    </div>
  );
};


export default function MyBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Completed" | "Cancelled">("Upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // State for Cancel Flow
  const [cancelPreview, setCancelPreview] = useState<CancelPreview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // CHECK URL ON LOAD: If URL contains ?tab=cancelled, instantly open Cancelled tab.
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
      
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "cancelled") {
        setActiveTab("Cancelled");
      }
    }
  }, []);

  // 1. Fetch Bookings API
  const fetchBookings = async () => {
    setRefreshing(true);
    setLoading(true);
    try {
      console.log("=== MY BOOKINGS ===");
      
      const userStr = localStorage.getItem('yesgo_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?._id || user?.id;

      if (!userId || userId.length < 10) {
        setBookings([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const url = `${BASE_URL}/api/busBooking/getAllBookings/${userId}`;
      const res = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });

      if (res.ok) {
        const data = await res.json();
        // Sort bookings: newest first
        const sortedBookings = (data.data || data.bookings || []).sort((a: any, b: any) => {
           return new Date(b.doj || b.departureDate).getTime() - new Date(a.doj || a.departureDate).getTime();
        });
        setBookings(sortedBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // 2. Initiate Cancel API (Dynamically routed based on provider)
  const handleInitiateCancel = async (booking: Booking) => {
    const bookingId = booking.id || booking._id; 
    if (!bookingId) return;

    const finalBlockKey = booking.blockKey || (booking as any).apipnrNo || ""; 
    const pnrNo = booking.pnr || (booking as any).pnrNumber || finalBlockKey;

    // 1. SMART PROVIDER DETECTION
    let provider = booking.apiProvider; 
    const opName = (booking.operatorName || (booking as any).busOperator || "").toUpperCase();
    
    if (!provider || provider === "EZEE") {
       if (finalBlockKey.toString().startsWith("TS") || opName.includes("SRS") || opName.includes("SIR") || (booking as any).isSrs) {
           provider = "SRS";
       } else if (opName.includes("VRL") || (booking as any).isVrl) {
           provider = "VRL";
       } else {
           provider = "EZEE";
       }
    }

    // 2. ROBUST SEAT EXTRACTION
    let seatsStr = "";
    const rawSeats = booking.seatNumbers || (booking as any).selectedSeats || (booking as any).ticketDetails || (booking as any).passengers || [];
    
    if (typeof rawSeats === 'string') {
      seatsStr = rawSeats.replace(/\s/g, ""); 
    } else if (Array.isArray(rawSeats)) {
      seatsStr = rawSeats.map((p: any) => 
        typeof p === 'string' ? p : (p?.seatName || p?.seatCode || p?.seat || p?.passenger?.seatName || p?.passenger?.seatCode)
      ).filter(Boolean).join(",");
    }

    if (provider === "VRL" && !pnrNo) {
      alert("PNR missing for VRL cancel");
      return;
    }

    if (provider === "SRS" && !finalBlockKey) {
      alert("BlockKey missing for SRS cancellation.");
      return;
    }

    if (provider === "SRS" && !seatsStr) {
      alert("Seat details missing for cancellation");
      return;
    }

    setIsProcessing(true);
    try {
      let endpoint = "";
      let options: any = {};

      if (provider === "VRL") {
        endpoint = `${BASE_URL}/api/busBooking/sendVrlRequest/CancelDetails`;
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pnrNo })
        };
      } 
      else if (provider === "SRS") {
        endpoint = `${BASE_URL}/api/busBooking/getSrsCanCancelDetails/${finalBlockKey}/${seatsStr}`;
        options = { method: "GET" };
      }
      else {
        endpoint = `${BASE_URL}/api/bus/ezee/canCancelSeat/${bookingId}`;
        options = { method: "GET" };
      }

      const res = await fetch(endpoint, options);
      const rawData = await res.json().catch(() => ({}));
      const data = rawData.response || rawData.data || rawData;

      if (data.success === false || rawData.success === false) {
        alert(data.message || rawData.message || "❌ This ticket cannot be cancelled. It may be past departure time or non-refundable.");
        return;
      }

      const isSuccess = res.ok || data.status === 200 || data.status === 0 || data.success === true || !!data.result || !!rawData.result;

      if (isSuccess) {
        let extCca = data.cca ?? data.cancellation_charges ?? data.CancellationCharges ?? 0;
        let extRef = data.refundAmount ?? data.refund_amount ?? data.RefundAmount ?? 0;
        let extCtpc = data.ctpc ?? data.policy ?? "DEFAULT";

        if (provider === "SRS") {
          const resultObj = rawData.result || data.result;
          const srsData = resultObj?.is_ticket_cancellable || resultObj || data?.is_ticket_cancellable;
          
          if (srsData) {
            if (srsData.is_cancellable === false) {
              alert("❌ This ticket cannot be cancelled. It is non-refundable.");
              setIsProcessing(false);
              return;
            }
            extCca = srsData.cancellation_charges ?? srsData.cancellationCharges ?? extCca;
            extRef = srsData.refund_amount ?? srsData.refundAmount ?? extRef;
          }
        }

        if (provider === "VRL") {
          const vrlList = Array.isArray(data) ? data : (Array.isArray(rawData.data) ? rawData.data : []);
          if (vrlList.length > 0) {
            const vrlData = vrlList || vrlList; 
            extRef = vrlData.RefundAmount ?? extRef;
            
            const calculatedCca = (vrlData.TotalFare !== undefined && vrlData.RefundAmount !== undefined) 
              ? (vrlData.TotalFare - vrlData.RefundAmount) 
              : extCca;
              
            extCca = vrlData.CancellationCharges ?? calculatedCca;
          }
        }
        
        if (provider === "EZEE") {
          extCca = data.cca ?? extCca;
          extCtpc = data.ctpc ?? extCtpc;
          if (!extRef && extCca) {
             const total = booking.totalFare || (booking as any).totalAmount || 0;
             extRef = Math.max(0, Number(total) - Number(extCca));
          }
        }

        setCancelPreview({
          bookingId: bookingId,
          apiProvider: provider,
          cca: String(extCca ?? "0"),
          ctpc: String(extCtpc),
          refundAmount: Number(extRef ?? 0),
          pnr: pnrNo,
          blockKey: finalBlockKey.toString(),
          seatNumbers: seatsStr
        });
        setSelectedBooking(null); 
      } else {
        alert(data.message || "❌ This ticket cannot be cancelled. It may be past departure time or non-refundable.");
      }
    } catch (error) {
      console.error("Cancel API Error:", error);
      alert("Network error while trying to connect to cancellation server.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Confirm Cancel API 
  const handleConfirmCancel = async () => {
    if (!cancelPreview) return;

    if (cancelPreview.apiProvider === "EZEE" && (!cancelPreview.cca || !cancelPreview.ctpc)) {
       alert("Invalid cancel data received. Please contact support.");
       return;
    }

    if (cancelPreview.apiProvider === "SRS" && !cancelPreview.blockKey) {
       alert("Missing blockKey for SRS cancel");
       return;
    }

    setIsProcessing(true);
    try {
      let endpoint = "";
      let options: any = {};

      if (cancelPreview.apiProvider === "VRL") {
        endpoint = `${BASE_URL}/api/busBooking/sendVrlRequest/ConfirmCancellation`;
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pnrNo: cancelPreview.pnr })
        };
      } 
      else if (cancelPreview.apiProvider === "SRS") {
        endpoint = `${BASE_URL}/api/busBooking/srsCancelBooking/${cancelPreview.blockKey}/${cancelPreview.seatNumbers}`;
        options = { method: "GET" };
      }
      else {
        endpoint = `${BASE_URL}/api/bus/ezee/confirmCancelSeat`;
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: cancelPreview.bookingId,
            cca: cancelPreview.cca,
            ctpc: cancelPreview.ctpc
          })
        };
      }

      const res = await fetch(endpoint, options);
      const rawData = await res.json().catch(() => ({}));
      const data = rawData.response || rawData;

      const isSuccess = res.ok || data.success === true || data.status === 0 || data.status === 200 || !!data.result;

      if (isSuccess) {
        const targetBooking = bookings.find(b => (b.id || b._id) === cancelPreview.bookingId);
        
        const refundRes = await fetch(`${BASE_URL}/api/payment/v2/refund-v2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId: (targetBooking as any)?.paymentId,
            type: "instant",
            amount: Number(cancelPreview.refundAmount),
          }),
        });

        const refundData = await refundRes.json();

        if (!refundRes.ok || refundData.success === false) {
          alert(refundData.message || "Ticket cancelled with provider, but refund failed. Please contact support.");
          return;
        }
        // --- LOCAL DB UPDATE ---
        try {
          await fetch(`${BASE_URL}/api/busBooking/updateBooking/${cancelPreview.bookingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookingStatus: "cancelled",
                status: "CANCELLED",
                totalRefundAmount: Number(cancelPreview.refundAmount),
                cancellationCharges: Number(cancelPreview.cca)
            })
          });

          if (targetBooking) {
            await fetch(`${BASE_URL}/api/busBooking/sendCancelTicketMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: cancelPreview.bookingId,
                    customerName: targetBooking.passengerName || (targetBooking as any).customerName || 'Customer',
                    opPNR: cancelPreview.pnr || targetBooking.pnr || cancelPreview.blockKey,
                    sourceCity: targetBooking.from || (targetBooking as any).sourceCity,
                    destinationCity: targetBooking.to || (targetBooking as any).destinationCity,
                    selectedSeats: cancelPreview.seatNumbers,
                    doj: targetBooking.departureDate || (targetBooking as any).doj,
                    totalRefundAmount: cancelPreview.refundAmount,
                    to: (targetBooking as any).customerPhone,
                    type: "cancellation"
                })
            });
          }
        } catch (dbErr) {
          console.error("Local DB update failed:", dbErr);
        }

        alert("Ticket cancelled successfully.");
        setCancelPreview(null);
        
        // Update local state instantly and switch tab
        setBookings(prev => prev.map(b => (b.id || b._id) === cancelPreview.bookingId ? { ...b, status: 'cancelled', bookingStatus: 'cancelled' } : b));
        setActiveTab("Cancelled"); 
        
        // Soft refresh data
        fetchBookings(); 
      } else {
        alert(`Failed to confirm cancellation: ${data.message || rawData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error("Confirm Cancel Error:", error);
      alert("Network error confirming cancellation.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Safe status checker
  const getSafeStatus = (b: any) => {
     const st = (b.status || b.bookingStatus || 'upcoming').toLowerCase();
     if (st === 'cancelled' || st === 'cancel') return 'cancelled';
     if (st === 'completed') return 'completed';
     return 'upcoming'; // treat paid/success/pending as upcoming in this UI context
  };

  const filtered = bookings.filter((b) => getSafeStatus(b) === activeTab.toLowerCase());
  const TABS = ["Upcoming", "Completed", "Cancelled"] as const;

  return (
    <div className="bus-page-container w-100" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 0.8s linear infinite; display: inline-block; }
        
        .booking-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(13,43,76,0.06) !important; border-color: #00AEEF !important; }
        .booking-card:hover .view-details-text { color: #00AEEF !important; }

        .tab-btn { background: transparent; border: none; padding: 14px 0; font-weight: 600; font-size: 14px; color: #94a3b8; border-bottom: 3px solid transparent; transition: all 0.2s ease-in-out; flex: 1; text-align: center; }
        .tab-btn:hover { color: #475569; }
        .tab-btn.active { color: #00AEEF; border-bottom-color: #00AEEF; font-weight: 700; }
        
        /* Modal Styles - Responsive */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.65); display: flex; align-items: center; justify-content: center; z-index: 1050; backdrop-filter: blur(5px); overflow-y: auto; }
        .custom-modal { background: #fff; width: 100%; max-width: 550px; border-radius: 16px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); margin: auto; }
        .modal-route-title { font-size: 20px; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .custom-hover-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .custom-danger-btn:hover { background-color: #fee2e2 !important; }

        @media (min-width: 768px) {
          .tab-btn { padding: 18px 0; font-size: 15px; }
          .modal-route-title { font-size: 24px; }
          .w-sm-auto { width: auto !important; }
        }

        .header-bg { background: linear-gradient(90deg, #0D2B4C 0%, #154378 100%); color: white; padding: 16px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; }
      `}</style>

      {/* ══ HEADER (Full Width) ══ */}
      <div className="header-bg sticky-top">
        <div className="container-fluid d-flex align-items-center px-3 px-md-4">
          <div className="d-flex align-items-center justify-content-center me-3 rounded-circle text-white flex-shrink-0" style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', cursor: "pointer", transition: '0.2s' }} onClick={() => router.push('/')}>
            <i className="bi bi-arrow-left fs-5"></i>
          </div>
          <h5 className="mb-0 fw-semibold text-truncate" style={{ fontSize: "18px", letterSpacing: "0.3px" }}>My Bookings</h5>
        </div>
      </div>

      {/* ── Tabs (Full Width) ── */}
      <div className="bg-white sticky-top shadow-sm" style={{ top: "68px", zIndex: 1000 }}>
        <div className="container-fluid d-flex px-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="container-fluid py-3 py-md-4 px-2 px-sm-3 px-md-5">
        {loading ? (
          <div className="text-center py-5 mt-5">
            <div className="spinner-border" style={{ color: "#00AEEF", width: "2.5rem", height: "2.5rem", borderWidth: "0.2em" }}></div>
            <div className="mt-3 text-muted fw-medium fs-6">Loading your bookings...</div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onRefresh={fetchBookings} refreshing={refreshing} />
        ) : (
          <div className="row justify-content-center mx-0">
            <div className="col-12 col-lg-10 col-xl-8 px-0 px-sm-2">
              {filtered.map((booking) => (
                <BookingCard 
                  key={booking.id || booking._id} 
                  booking={booking} 
                  onClick={(b) => setSelectedBooking(b)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary Details Modal */}
      <TicketModal 
        booking={selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        onInitiateCancel={handleInitiateCancel}
        isProcessing={isProcessing}
      />

      {/* Cancel Confirmation Modal */}
      {cancelPreview && (
        <div className="modal-overlay p-3" style={{ zIndex: 1060 }}>
          <div className="custom-modal slide-up text-center p-4" style={{ maxWidth: "450px" }}>
            <div className="d-flex justify-content-center align-items-center mb-3 mx-auto" style={{ width: "60px", height: "60px", backgroundColor: "#fee2e2", borderRadius: "50%" }}>
              <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "30px" }}></i>
            </div>
            <h5 className="mt-2 fw-bold" style={{ color: "#1e293b" }}>Confirm Cancellation</h5>
            <p className="text-muted mt-2 px-1" style={{ fontSize: "14px" }}>Are you sure you want to cancel this ticket? This action cannot be undone.</p>
            
            <div className="p-3 rounded-4 mb-4 mt-3 text-start shadow-sm" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div className="d-flex justify-content-between mb-2 align-items-center border-bottom pb-2 border-light">
                <span className="text-muted fw-semibold" style={{ fontSize: "13px" }}>Cancellation Charges</span>
                <strong className="fs-6" style={{ color: "#1e293b" }}>₹{cancelPreview.cca}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-1">
                <span className="text-success fw-bold" style={{ fontSize: "14px" }}>Estimated Refund</span>
                <strong className="fs-5 text-success">₹{cancelPreview.refundAmount}</strong>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3">
              <button className="btn py-2 py-sm-3 fw-bold flex-grow-1 text-muted" style={{ backgroundColor: "#f1f5f9", borderRadius: "10px", border: "none", fontSize: "14px" }} onClick={() => setCancelPreview(null)} disabled={isProcessing}>
                Keep Ticket
              </button>
              <button className="btn btn-danger py-2 py-sm-3 fw-bold flex-grow-1" style={{ borderRadius: "10px", boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)", fontSize: "14px" }} onClick={handleConfirmCancel} disabled={isProcessing}>
                {isProcessing ? <span className="spinner-border spinner-border-sm"></span> : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}