export default function Loading() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse">
        <thead className="bg-gray-100">
          <tr>
            {["Airline", "Flight Number", "Departure", "Arrival", "Duration", "Price"].map((title) => (
              <th
                key={title}
                className="text-left px-4 py-2 border-b text-gray-300"
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              {[...Array(6)].map((__, idx2) => (
                <td
                  key={idx2}
                  className="px-4 py-3 border-b"
                >
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
