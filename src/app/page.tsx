'use client';

import FlightPage from "@/components/UI/Flights";
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
    <div className="">


      <FlightPage />
    </div>
  );
}

