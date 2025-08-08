export interface AccessTokenProps {
  access_token: string;
  token_type: string;
  expires_in: number;
  state?: string;
}

export interface FlightSearchParams {
  from: string;
  to: string;
  departureDate: string;
  return?: string;
  passengers: number;
}
