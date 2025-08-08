/* eslint-disable @typescript-eslint/no-explicit-any */
type FlightTableProps = {
  flights: any[];
};

export default function FlightTable({ flights }: FlightTableProps) {
  if (flights.length === 0) {
    return <p className="text-center py-6">No flights found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full  border-gray-200 rounded-lg shadow-sm backdrop-blur-2xl  bg-black/10 ">
        <thead className="backdrop-blur-3xl bg-white/60 ">
          <tr>
            <th className="text-left px-4 py-2 border-b">Airline</th>
            <th className="text-left px-4 py-2 border-b">Flight Number</th>
            <th className="text-left px-4 py-2 border-b">Departure</th>
            <th className="text-left px-4 py-2 border-b">Arrival</th>
            <th className="text-left px-4 py-2 border-b">Duration</th>
            <th className="text-left px-4 py-2 border-b">Price</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => {
            const itinerary = flight.itineraries[0];
            const segment = itinerary.segments[0];
            const departure = segment.departure;
            const arrival = segment.arrival;
            const airline = flight.validatingAirlineCodes?.[0] || "N/A";
            const flightNumber = segment.number;
            const duration = itinerary.duration.replace("PT", "").toLowerCase(); // PT1H30M → 1h30m
            const price = flight.price?.total || "N/A";

            return (
              <tr key={flight.id} className="hover:backdrop-blur-xl text-white hover:bg-white/20 hover:cursor-pointer">
                <td className="px-4 py-2 border-b">{airline}</td>
                <td className="px-4 py-2 border-b">{flightNumber}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(departure.at).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">
                  {new Date(arrival.at).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">{duration}</td>
                <td className="px-4 py-2 border-b">${price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
