'use client';

import useLocationSuggestion from "@/hooks/useLocationSuggestion";
import { getFlightOffers } from "@/services";
import { useEffect, useRef, useState } from "react";

type FlightType = "oneway" | "return";

const FlightsSearchForm = () => {
  const [flightType, setFlightType] = useState<FlightType>("oneway");
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  const fromSuggestions = useLocationSuggestion(from);
  const toSuggestions = useLocationSuggestion(to);
  const [fromIndex, setFromIndex] = useState(-1);
  const [toIndex, setToIndex] = useState(-1);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setFromFocused(false);
        setFromIndex(-1);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setToFocused(false);
        setToIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for From
  const handleFromKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (fromSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFromIndex(prev => (prev < fromSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFromIndex(prev => (prev > 0 ? prev - 1 : fromSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (fromIndex >= 0) {
        setFrom(fromSuggestions[fromIndex].name);
        setFromFocused(false);
        setFromIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setFromFocused(false);
      setFromIndex(-1);
    }
  };

  // Keyboard navigation for To
  const handleToKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (toSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setToIndex(prev => (prev < toSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setToIndex(prev => (prev > 0 ? prev - 1 : toSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (toIndex >= 0) {
        setTo(toSuggestions[toIndex].name);
        setToFocused(false);
        setToIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setToFocused(false);
      setToIndex(-1);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!from || !to) {
      alert("Please fill in both From and To fields.");
      return;
    }

    if (from === to) {
      alert("From and To locations cannot be the same.");
      return;
    }


    const validFrom = fromSuggestions.some(s => s.name === from);
    const validTo = toSuggestions.some(s => s.name === to);

    if (!validFrom) {
      alert("Please select a valid 'From' location from suggestions.");
      return;
    }
    if (!validTo) {
      alert("Please select a valid 'To' location from suggestions.");
      return;
    }

    if (!departureDate) {
      alert("Please select a departure date.");
      return;
    }

    if (flightType === "return") {
      if (!returnDate) {
        alert("Please select a return date.");
        return;
      }
      if (new Date(returnDate) < new Date(departureDate)) {
        alert("Return date cannot be earlier than departure date.");
        return;
      }
    }

    const searchData = {
      originLocationCode: fromSuggestions.find(s => s.name === from)?.iataCode || '',
      destinationLocationCode: toSuggestions.find(s => s.name === to)?.iataCode || '',
      departureDate,
      returnDate: flightType === "return" ? returnDate : undefined,
      adults: 1,
    };

    try {
      const response = await getFlightOffers(searchData);
      console.log("Flight results:", response);

    } catch (error) {
      console.error("Error fetching flights:", error);
      alert("Something went wrong. Please try again.");
    }



    console.log("Search data:", searchData);
  };

  return (
    <form className="max-w-md mx-auto p-6 bg-white shadow rounded space-y-6" onSubmit={handleSubmit}>
      {/* Flight Type */}
      <div className="flex space-x-6 items-center">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="flightType"
            value="oneway"
            checked={flightType === "oneway"}
            onChange={() => setFlightType("oneway")}
            className="form-radio"
          />
          <span>One way</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="flightType"
            value="return"
            checked={flightType === "return"}
            onChange={() => setFlightType("return")}
            className="form-radio"
          />
          <span>Return</span>
        </label>
      </div>

      {/* From */}
      <div className="relative" ref={fromRef}>
        <label htmlFor="from" className="block font-medium mb-1">From</label>
        <input
          id="from"
          type="text"
          placeholder="City or country"
          value={from}
          onChange={e => {
            setFrom(e.target.value);
            setFromIndex(-1);
          }}
          onFocus={() => setFromFocused(true)}
          onKeyDown={handleFromKeyDown}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="from-suggestions"
          aria-activedescendant={fromIndex >= 0 ? `from-sug-${fromIndex}` : undefined}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fromFocused && fromSuggestions.length > 0 && (
          <ul
            id="from-suggestions"
            className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-48 overflow-auto mt-1 shadow-lg"
            role="listbox"
          >
            {fromSuggestions.map((sug, i) => (
              <li
                key={sug.iataCode}
                id={`from-sug-${i}`}
                role="option"
                aria-selected={fromIndex === i}
                onClick={() => {
                  setFrom(sug.name);
                  setFromFocused(false);
                  setFromIndex(-1);
                }}
                onMouseEnter={() => setFromIndex(i)}
                className={`cursor-pointer px-3 py-2 ${fromIndex === i ? 'bg-blue-600 text-white' : 'text-gray-800'}`}
              >
                {sug.name} ({sug.iataCode}) - {sug.countryName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* To */}
      <div className="relative" ref={toRef}>
        <label htmlFor="to" className="block font-medium mb-1">To</label>
        <input
          id="to"
          type="text"
          placeholder="City or country"
          value={to}
          onChange={e => {
            setTo(e.target.value);
            setToIndex(-1);
          }}
          onFocus={() => setToFocused(true)}
          onKeyDown={handleToKeyDown}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="to-suggestions"
          aria-activedescendant={toIndex >= 0 ? `to-sug-${toIndex}` : undefined}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {toFocused && toSuggestions.length > 0 && (
          <ul
            id="to-suggestions"
            className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-48 overflow-auto mt-1 shadow-lg"
            role="listbox"
          >
            {toSuggestions.map((sug, i) => (
              <li
                key={sug.iataCode}
                id={`to-sug-${i}`}
                role="option"
                aria-selected={toIndex === i}
                onClick={() => {
                  setTo(sug.name);
                  setToFocused(false);
                  setToIndex(-1);
                }}
                onMouseEnter={() => setToIndex(i)}
                className={`cursor-pointer px-3 py-2 ${toIndex === i ? 'bg-green-600 text-white' : 'text-gray-800'}`}
              >
                {sug.name} ({sug.iataCode}) - {sug.countryName}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Passengers */}
      {/* <div className="relative" ref={toRef}>
        <select name="passengers" id="passengers">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        
      </div> */}

      {/* Departure Date */}
      <div>
        <label htmlFor="departureDate" className="block font-medium mb-1">Departure Date</label>
        <input
          id="departureDate"
          type="date"
          value={departureDate}
          onChange={e => setDepartureDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Return Date (conditional) */}
      {flightType === "return" && (
        <div>
          <label htmlFor="returnDate" className="block font-medium mb-1">Return Date</label>
          <input
            id="returnDate"
            type="date"
            value={returnDate}
            onChange={e => setReturnDate(e.target.value)}
            min={departureDate || new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Search Flights
      </button>
    </form>
  );
};

export default FlightsSearchForm;
