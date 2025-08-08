/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/flights/route.ts
import { getAccessToken } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { originLocationCode, destinationLocationCode, departureDate, adults } =
    body;

  if (
    !originLocationCode ||
    !destinationLocationCode ||
    !departureDate ||
    !adults
  ) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const token = await getAccessToken();

    const queryParams = new URLSearchParams({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults: String(adults),
      currencyCode: 'USD',
      max: '10',
    });

    const res = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server Error' },
      { status: 500 }
    );
  }
}
