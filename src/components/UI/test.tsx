/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getAirportSuggestions } from "@/lib";
import Image from "next/image";
import { useEffect, useState } from "react";

const FlightTicket = () => {
  const [fromQuery, setFromQuery] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (fromQuery.length > 1) {
        const results = await getAirportSuggestions(fromQuery);
        setFromSuggestions(results);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [fromQuery]);
  return (
    <section>
      {/* Input Data */}
      <div className="mt-[160px] mx-4 md:mt-[160px] relative">
        <div className="backdrop-blur-3xl bg-white/85 rounded-md max-w-6xl w-full mx-auto">
          <form className="first-hero lws-inputform">
            {/* From */}
            <div className="des-from">
              <p>Destination From</p>
              <div className="flex flex-row p-5">
                <Image width={20} height={20} src="./img/icons/Frame.svg" alt="" />
                <input placeholder="Country,City Or Airport" className="outline-none px-2 py-2 w-full placeholder:text-sm relative" name="from" id="lws-from" required onChange={(e) => setFromQuery(e.target.value)} />

                {fromSuggestions.length > 0 && (
                  <ul className="absolute top-25 z-10 bg-white shadow border  inline-block mt-1 rounded">
                    {fromSuggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => {
                          setFromQuery(item.name);
                          setFromSuggestions([]);
                        }}
                        className="text-sm cursor-pointer p-2 hover:bg-gray-100 "
                      >
                        {item.name} ({item.iataCode})
                      </li>
                    ))}
                  </ul>
                )}

              </div>
            </div>
            {/* To */}
            <div className="des-from">
              <p>Destination To</p>
              <div className="flex flex-row">
                <Image width={20} height={20} src="./img/icons/Frame.svg" alt="" />
                <input placeholder="Country,City Or Airport" className="outline-none px-2 py-2 w-full placeholder:text-sm" name="from" id="lws-from" required />
              </div>
            </div>
            {/* Date */}
            <div className="des-from">
              <p>Journey Date</p>
              <input type="date" className="outline-none px-2 py-2 w-full date " name="date" id="lws-date" required />
            </div>
            {/* Guests */}
            <div className="des-from">
              <p>Guests</p>
              <div className="flex flex-row">
                <Image width={20} height={20} alt="" src="./img/icons/Vector (1).svg" />
                <select className="outline-none px-2 py-2 w-full" name="guests" id="lws-guests" required>
                  <option value="" hidden>Please Select</option>
                  <option value={1}>1 Person</option>
                  <option value={2}>2 Persons</option>
                  <option value={3}>3 Persons</option>
                  <option value={4}>4 Persons</option>
                </select>
              </div>
            </div>
            {/* Class */}
            <div className="des-from !border-r-0">
              <p>Class</p>
              <div className="flex flex-row">
                <Image width={20} height={20} src="./img/icons/Vector (3).svg" alt="" />
                <select className="outline-none px-2 py-2 w-full" name="ticketClass" id="lws-ticketClass" required>
                  <option value="" hidden>Please Select</option>
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First</option>
                </select>
              </div>
            </div>
            <button className="addCity" type="submit" id="lws-addCity">
              <svg width="15px" height="15px" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-sm">Search</span>
            </button>
          </form>
        </div>
      </div>
      {/* Preview Data */}

    </section>

  );
};

export default FlightTicket;