// lib/amadeus/getFlightOffers.ts

import { getAccessToken } from '@/lib';

interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: string;
  currencyCode?: string;
  max?: number;
}

export const getFlightOffers = async (params: FlightSearchParams) => {
  const token = await getAccessToken();

  const searchParams = new URLSearchParams({
    originLocationCode: params.originLocationCode,
    destinationLocationCode: params.destinationLocationCode,
    departureDate: params.departureDate,
    adults: params.adults.toString(),
  });

  if (params.returnDate) searchParams.append('returnDate', params.returnDate);
  if (params.children)
    searchParams.append('children', params.children.toString());
  if (params.infants) searchParams.append('infants', params.infants.toString());
  if (params.travelClass)
    searchParams.append('travelClass', params.travelClass);
  if (params.currencyCode)
    searchParams.append('currencyCode', params.currencyCode);
  if (params.max) searchParams.append('max', params.max.toString());

  const response = await fetch(
    `https://test.api.amadeus.com/v2/shopping/flight-offers?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.errors?.[0]?.detail ||
        'Something went wrong while fetching flights.'
    );
  }

  return data;
};
