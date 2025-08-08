/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getAirportSuggestions } from "@/lib";
import { CalendarDaysIcon, MapPinIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
export type FormValues = {
  from: string;
  to: string;
  date: string;
  passengers: number;
};
type Props = {
  onSearch: (data: FormValues) => void;
};
export default function FlightSearchForm({ onSearch }: Props) {
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      from: "",
      to: "",
      date: "",
      passengers: 1,
    },
  });
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [fromSelected, setFromSelected] = useState(false);
  const [toSelected, setToSelected] = useState(false);
  const fromValue = watch("from");
  const toValue = watch("to");

  useEffect(() => {
    if (!fromSelected && fromValue.length > 1) {
      getAirportSuggestions(fromValue).then((res) => {
        setFromSuggestions(res);
      });
    } else {
      setFromSuggestions([]);
    }
  }, [fromValue, fromSelected]);

  useEffect(() => {
    if (!toSelected && toValue.length > 1) {
      getAirportSuggestions(toValue).then((res) => {
        const filtered = res.filter(
          (item) =>
            item.address?.cityName?.toLowerCase() !==
            fromValue?.toLowerCase()
        );
        setToSuggestions(filtered);
      });
    } else {
      setToSuggestions([]);
    }
  }, [toValue, fromValue, toSelected]);
  return (
    <section className="container mx-auto py-8">
      <div className="backdrop-blur-xl bg-white/20 rounded-lg shadow-lg p-6">
        <form
          onSubmit={handleSubmit(onSearch)}
          className=""
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {/* From */}
            <div>
              <Controller
                name="from"
                control={control}
                rules={{ required: "From city is required" }}
                render={({ field, fieldState }) => (
                  <div className="relative">
                    <label className="flex items-center mb-1 font-semibold text-white" htmlFor="from">
                      <MapPinIcon className="w-5 h-5 mr-2 text-blue-600" /> From
                    </label>
                    <input
                      {...field}
                      id="from"
                      type="text"
                      placeholder="City or Airport"
                      className={`w-full border rounded-lg text-white px-4 py-3 backdrop-blur-3xl bg-black/40 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldState.error ? "border-red-500" : "border-gray-300"
                        }`}
                      autoComplete="off"
                      onChange={(e) => {
                        setFromSelected(false);
                        field.onChange(e);
                      }}
                    />
                    {fromSuggestions.length > 0 && (
                      <ul className="absolute z-30 bg-white border border-gray-300 rounded-lg w-full max-h-52 overflow-auto mt-1 shadow-lg">
                        {fromSuggestions.map((item) => (
                          <li
                            key={item.id}
                            className="cursor-pointer px-4 py-2 hover:bg-blue-100 text-[13px] capitalize"
                            onClick={() => {
                              setValue("from", `${item.name} (${item.iataCode})`);
                              setFromSuggestions([]);
                              setFromSelected(true);
                            }}
                          >
                            <MapPinIcon className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold">{item.name} ({item.iataCode})</span> — {item.address?.cityName}, {item.address?.countryName}
                          </li>
                        ))}
                      </ul>
                    )}
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            {/* To */}
            <div>
              <Controller
                name="to"
                control={control}
                rules={{ required: "Destination is required" }}
                render={({ field, fieldState }) => (
                  <div className="relative">
                    <label className="flex items-center mb-1 font-semibold text-white" htmlFor="to">
                      <MapPinIcon className="w-5 h-5 mr-2 text-green-600" /> To
                    </label>
                    <input
                      {...field}
                      id="to"
                      type="text"
                      placeholder="City or Airport"
                      className={`w-full text-white border rounded-lg px-4 py-3 backdrop-blur-3xl bg-black/40 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 ${fieldState.error ? "border-red-500" : "border-gray-300"
                        }`}
                      autoComplete="off"
                      onChange={(e) => {
                        setToSelected(false);
                        field.onChange(e);
                      }}
                    />
                    {toSuggestions.length > 0 && (
                      <ul className="absolute z-30 bg-white border border-gray-300 rounded-lg w-full max-h-52 overflow-auto mt-1 shadow-lg">
                        {toSuggestions.map((item) => (
                          <li
                            key={item.id}
                            className="cursor-pointer px-4 py-2 hover:bg-green-100 text-[13px] capitalize"
                            onClick={() => {
                              setValue("to", `${item.name} (${item.iataCode})`);
                              setToSuggestions([]);
                              setToSelected(true);
                            }}
                          >
                            <MapPinIcon className="w-5 h-5 text-green-500" />
                            <span className="font-semibold">{item.name} ({item.iataCode})</span> — {item.address?.cityName}, {item.address?.countryName}
                          </li>
                        ))}
                      </ul>
                    )}
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            {/* Date */}
            <div>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Travel date is required" }}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="flex items-center mb-1 font-semibold text-white" htmlFor="date">
                      <CalendarDaysIcon className="w-5 h-5 mr-2 text-purple-600" /> Journey Date
                    </label>
                    <input
                      {...field}
                      id="date"
                      type="date"
                      className={`w-full text-white border rounded-lg px-4 py-3 backdrop-blur-3xl bg-black/40 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${fieldState.error ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
            {/* Passengers */}
            <div>
              <Controller
                name="passengers"
                control={control}
                rules={{
                  required: "Please select number of passengers",
                  min: { value: 1, message: "At least one passenger required" },
                  max: { value: 10, message: "Maximum 10 passengers allowed" },
                }}
                render={({ field, fieldState }) => (
                  <div>
                    <label className="flex items-center mb-1 font-semibold text-white" htmlFor="passengers">
                      <UserGroupIcon className="w-5 h-5 mr-2 text-yellow-600" /> Passengers
                    </label>
                    <select
                      {...field}
                      id="passengers"
                      className={`w-full text-white border rounded-lg px-4 py-3 backdrop-blur-3xl bg-black/40 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${fieldState.error ? "border-red-500" : "border-gray-300"
                        }`}
                    >
                      {[...Array(9)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? "Person" : "Persons"}
                        </option>
                      ))}
                    </select>
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          {/* Submit Button */}
          <div className="w-full md:w-1/4 mx-auto my-5 ">
            <button
              type="submit"
              className=" w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Search Flights
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
