import React from 'react';

interface Step2Props {
  boardingPoints: any[];
  droppingPoints: any[];
  selectedBp: any;
  setSelectedBp: (point: any) => void;
  selectedDp: any;
  setSelectedDp: (point: any) => void;
  departureTime: string;
  arrivalTime: string;
}

export default function Step2PointSelection({
  boardingPoints, droppingPoints, selectedBp, setSelectedBp, selectedDp, setSelectedDp, departureTime, arrivalTime
}: Step2Props) {

  const checkPointEquality = (p1: any, p2: any) => {
    if (!p1 || !p2) return false;
    const id1 = p1.id || p1.stage_id || p1.bp_id || p1.dp_id || p1.bpId || p1.dpId || p1.LocationId || p1.providerId || p1.value;
    const id2 = p2.id || p2.stage_id || p2.bp_id || p2.dp_id || p2.bpId || p2.dpId || p2.LocationId || p2.providerId || p2.value;
    if (id1 && id2 && id1 !== "0" && id1 !== "undefined") return String(id1) === String(id2);
    const key1 = `${p1.stage || p1.name || p1.locationName || p1}-${p1.time || p1.Time || ""}`;
    const key2 = `${p2.stage || p2.name || p2.locationName || p2}-${p2.time || p2.Time || ""}`;
    return key1 === key2 && key1 !== "-";
  };

  const renderPointSelectionItem = (point: any, type: 'boarding' | 'dropping', index: number) => {
    const isSelected = type === 'boarding' ? checkPointEquality(selectedBp, point) : checkPointEquality(selectedDp, point);
    const defaultTime = type === 'boarding' ? departureTime : arrivalTime;
    const time = point?.time || point?.Time || point?.bpTime || point?.dpTime || defaultTime;
    const locationName = point?.stage || point?.locationName || point?.LocationName || point?.name || point?.Name || point?.bpName || point?.dpName || (typeof point === 'string' ? point : "Point");
    const landmark = point?.landmark || point?.Landmark || point?.address || point?.Address || "";

    return (
      <div 
        key={`${type}-${locationName}-${time}-${index}`}
        onClick={() => {
          // ✅ FIX: Ensure the time is explicitly added to the selected object
          const pointWithTime = { ...point, time: time };
          if (type === 'boarding') setSelectedBp(pointWithTime);
          else setSelectedDp(pointWithTime);
        }}
        className="d-flex align-items-center p-3 mb-3 bg-white"
        style={{ cursor: 'pointer', borderRadius: '8px', border: isSelected ? '2px solid #0D2B4C' : '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s ease-in-out' }}
      >
        <div className="me-3 flex-shrink-0 d-flex align-items-center">
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isSelected ? '#0D2B4C' : '#9CA3AF'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0D2B4C' }} />}
          </div>
        </div>
        <div>
          <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{locationName}</div>
          {landmark && <div className="text-muted mt-1" style={{ fontSize: '12px', lineHeight: '1.3' }}>{landmark}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="row g-4 justify-content-center w-100 mx-0">
      <div className="col-12 col-md-6 col-lg-6">
        <div className="p-4 rounded h-100" style={{ backgroundColor: '#F9FAFB', minHeight: '500px' }}>
          <h4 className="fw-bold text-dark mb-1">Boarding points</h4>
          <p className="text-muted small mb-4">Select Boarding Point</p>
          <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '5px' }}>
            {boardingPoints.length > 0 ? (
              boardingPoints.map((point, index) => renderPointSelectionItem(point, 'boarding', index)) 
            ) : (
              <div className="text-muted mt-3">No specific boarding points found.</div>
            )}
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-6">
        <div className="p-4 rounded h-100" style={{ backgroundColor: '#F9FAFB', minHeight: '500px' }}>
          <h4 className="fw-bold text-dark mb-1">Dropping points</h4>
          <p className="text-muted small mb-4">Select Dropping Point</p>
          <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '5px' }}>
            {droppingPoints.length > 0 ? (
              droppingPoints.map((point, index) => renderPointSelectionItem(point, 'dropping', index)) 
            ) : (
              <div className="text-muted mt-3">No specific dropping points found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}