import {
  fetchVrlBuses,
  fetchSrsBuses,
  fetchCitySuggestions,
  fetchBusFilters,
  NormalizedBus
} from "../components/api";

export const fetchAllBusData = async (
  sourceName: string,
  destName: string,
  journeyDate: string,
  vrlSourceId?: string | null,
  vrlDestId?: string | null,
  srsSourceId?: string | null,
  srsDestId?: string | null
) => {
  let vSource = vrlSourceId;
  let vDest = vrlDestId;
  let sSource = srsSourceId;
  let sDest = srsDestId;

  // 1. Resolve IDs if they are missing
  if (!vSource || !vDest || !sSource || !sDest) {
    const [sourceRes, destRes] = await Promise.all([
      fetchCitySuggestions(sourceName),
      fetchCitySuggestions(destName)
    ]);
    const sMatch = sourceRes.find((c: any) => c.name.toLowerCase() === sourceName.toLowerCase());
    const dMatch = destRes.find((c: any) => c.name.toLowerCase() === destName.toLowerCase());
    
    if (sMatch && dMatch) {
      vSource = vSource || sMatch.vrlCityId || undefined;
      vDest = vDest || dMatch.vrlCityId || undefined;
      sSource = sSource || sMatch.srsCityId || undefined;
      sDest = sDest || dMatch.srsCityId || undefined;
    }
  }

  // 2. Fetch all data in parallel
  const [vrl, srs, vrlFiltersData, srsFiltersData] = await Promise.all([
    vSource && vDest ? fetchVrlBuses(sourceName, destName, vSource, vDest, journeyDate) : [],
    sSource && sDest ? fetchSrsBuses(sourceName, destName, sSource, sDest, journeyDate) : [],
    vSource && vDest ? fetchBusFilters("VRL", { sourceName, destName, date: journeyDate, sourceId: vSource, destId: vDest }) : null,
    sSource && sDest ? fetchBusFilters("SRS", { sourceName, destName, date: journeyDate, sourceId: sSource, destId: sDest }) : null
  ]);

  // 3. Combine Buses
  let combinedBuses: NormalizedBus[] = [...(vrl || []), ...(srs || [])];

  // 4. Combine Filters (Boarding / Dropping)
  let combinedBoarding: any[] = [];
  let combinedDropping: any[] = [];

  if (vrlFiltersData?.data?.boardingPoints) combinedBoarding.push(...vrlFiltersData.data.boardingPoints);
  if (srsFiltersData?.boardingPoints) combinedBoarding.push(...srsFiltersData.boardingPoints);
  if (vrlFiltersData?.data?.droppingPoints) combinedDropping.push(...vrlFiltersData.data.droppingPoints);
  if (srsFiltersData?.droppingPoints) combinedDropping.push(...srsFiltersData.droppingPoints);

  return {
    buses: combinedBuses,
    boardingPoints: combinedBoarding,
    droppingPoints: combinedDropping
  };
};