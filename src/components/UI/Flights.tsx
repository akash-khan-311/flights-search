"use client";

import { useFlightSearch } from "@/hooks/useFlightSearch";
import FlightSearchForm, { FormValues } from "./FlightSearchForm";
import FlightTable from "./FlightTable";

export default function FlightPage() {
  const { flights, loading, error, searchFlights } = useFlightSearch();

  const handleSearch = (data: FormValues) => {
    searchFlights(data);
  };

  console.log(flights);

  return (
    <section className="container mx-auto py-8">
      <div className="">
        <FlightSearchForm onSearch={handleSearch} />

        {loading && <p className="mt-4 text-center text-blue-600">Loading flights...</p>}

        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        <div className="">
          <div>

            {/* টেবিল কম্পোনেন্টে ডাটা পাঠাও */}
            {!loading && !error && flights.length > 0 && (
              <FlightTable flights={flights} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
