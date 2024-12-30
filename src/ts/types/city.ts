export type City = {
  id: number;
  name: string;
  dealerships: Dealership[];
  headOffice?: HeadOffice;
};

export type HeadOffice = {
  id: number;
  name: string;
  phones: string[];
  email: string;
  address: string;
  location: DealershipLocation;
};

export type Dealership = {
  id: number;
  name: string;
  phones: string[];
  email: string;
  links: DealershipLink[];
  address: string;
  is_branded: boolean;
  opening_hours: string;
  location: DealershipLocation;
  headOffice: boolean;
};

export type DealershipLocation = {
  latitude: number;
  longitude: number;
};

export type DealershipLink = {
  link: string;
  title: string;
};
