/* eslint-disable @typescript-eslint/no-explicit-any */
type FlightTableProps = {
  flights: any[];
};

export default function FlightTable({ flights }: FlightTableProps) {
  console.log(flights);

  return (
    <div className="overflow-x-auto px-3 md:px-0">
      <h1 className="text-5xl md:text-6xl lg:text-7xl flex justify-center items-center bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text font-medium my-8 text-center">✈ Pick the Best Flight for You</h1>
      <table className="min-w-full rounded-xl border-gray-200 shadow-sm backdrop-blur-2xl bg-black/10 ">
        <thead className="backdrop-blur-3xl bg-white/60">
          <tr>
            <th className="text-left px-4 py-2 border-b">Airline</th>
            <th className="text-left px-4 py-2 border-b">Flight Number</th>
            <th className="text-left px-4 py-2 border-b">Departure</th>
            <th className="text-left px-4 py-2 border-b">Arrival</th>
            <th className="text-left px-4 py-2 border-b">Duration</th>
            <th className="text-left px-4 py-2 border-b">Stops</th> {/* Stops column */}
            <th className="text-left px-4 py-2 border-b">Price</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => {
            const itinerary = flight.itineraries[0];
            const segments = itinerary.segments;
            const departure = segments[0].departure;
            const arrival = segments[segments.length - 1].arrival;
            const airline = flight.validatingAirlineCodes?.[0] || "N/A";
            const flightNumber = segments[0].number;
            const duration = itinerary.duration.replace("PT", "").toLowerCase(); // PT1H30M → 1h30m
            const price = flight.price?.total || "N/A";
            const stops = segments.length - 1;

            return (
              <tr
                key={flight.id}
                className="hover:backdrop-blur-xl text-white hover:bg-white/20 hover:cursor-pointer"
              >
                <td className="px-4 py-2 border-b">{airline}</td>
                <td className="px-4 py-2 border-b">{flightNumber}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(departure.at).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">
                  {new Date(arrival.at).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">{duration}</td>
                <td className="px-4 py-2 border-b">
                  {stops === 0 ? "Non-stop" : stops}
                </td>
                <td className="px-4 py-2 border-b">${price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
