"use client";

import { useFlightSearch } from "@/hooks/useFlightSearch";
import { useState } from "react";
import FlightSearchForm, { FormValues } from "./FlightSearchForm";
import FlightTable from "./FlightTable";
import Loading from "./Loading";
export default function FlightPage() {
  const { flights, loading, error, searchFlights } = useFlightSearch();
  const [hasSearched, setHasSearched] = useState(false);
  const handleSearch = (data: FormValues) => {
    setHasSearched(true);
    searchFlights(data);
  };

  console.log({ loading, error, flights });

  return (
    <section className="container mx-auto py-8 px-3 md:px-0">
      <div className="">
        <FlightSearchForm onSearch={handleSearch} />
        {loading && <Loading />}
        {error && <p className="text-2xl md:text-3xl lg:text-5xl flex justify-center items-center ">{error}</p>}
        <div className="">
          <div>
            {!loading && !error && flights.length > 0 && (
              <FlightTable flights={flights} />
            )}
            {hasSearched && !loading && !error && flights.length === 0 && (
              <div className="flex flex-col justify-center items-center gap-y-5">
                <h2 className="text-5xl md:text-6xl lg:text-7xl text-white">
                  No Flights Found
                </h2>
                <p className="text-base md:text-xl text-white">
                  Please try again with different search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
