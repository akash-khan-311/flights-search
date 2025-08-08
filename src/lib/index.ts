/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessTokenProps } from '@/types';

export const getAccessToken = async (): Promise<string> => {
  const response = await fetch(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.NEXT_PUBLIC_API_KEY || '',
        client_secret: process.env.NEXT_PUBLIC_API_SECRET || '',
      }),
    }
  );

  const data: AccessTokenProps = await response.json();

  if (!response.ok) {
    throw new Error(`Token Error: ${data?.state || 'Unknown error'}`);
  }

  return data.access_token;
};

// src/lib/amadeus.ts

export const getAirportSuggestions = async (
  keyword: string
): Promise<any[]> => {
  try {
    const token = await getAccessToken();

    const res = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    const data = await res.json();
    console.log('this is from suggestions', data);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};
