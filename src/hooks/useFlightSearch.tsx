/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useFlightSearch.ts
import { getFlightOffers } from "@/services";
import { useState } from "react";

export type FlightSearchParams = {
  from: string;
  to: string;
  date: string;
  passengers: number;
};

export const useFlightSearch = () => {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractIATACode = (str: string) => {
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1] : "";
  };

  const searchFlights = async (params: FlightSearchParams) => {
    setLoading(true);
    setError(null);
    setFlights([]);

    try {
      const flightData = await getFlightOffers({
        originLocationCode: extractIATACode(params.from),
        destinationLocationCode: extractIATACode(params.to),
        departureDate: params.date,
        adults: params.passengers,
        max: 10,
      });
      setFlights(flightData.data || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch flights");
    } finally {
      setLoading(false);
    }
  };

  return { flights, loading, error, searchFlights };
};
