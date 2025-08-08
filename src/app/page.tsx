'use client';

import FlightTicket from "@/components/UI/test";
interface FlightTicketProps {
  tripType: string;
  flightClass: string;
  departureCity: string;
  departureCode: string;
  arrivalCity: string;
  arrivalCode: string;
  departureDate: string;
  returnDate: string;
}

export default function Home() {
  return (
    <div className="flex justify-center flex-col items-center ">
      <FlightTicket />
      {/* <FlightsSearchForm /> */}
    </div>
  );
}

