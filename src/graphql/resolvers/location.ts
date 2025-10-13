import { Context } from "../../types/context";
import { LocationService } from "../services/location";

export const LocationResolver = {
  Query: {
    countries: (_parent: unknown, _args: unknown, context: Context) => LocationService.getCountries(context),
    regions: (_parent: unknown, _args: { countryId: number }, context: Context) =>
      LocationService.getRegionsByCountry(_args.countryId, context),
    cities: (_parent: unknown, _args: { regionId: number }, context: Context) => LocationService.getCitiesByRegion(_args.regionId, context),
    counties: (_parent: unknown, _args: { cityId: number }, context: Context) => LocationService.getCountiesByCity(_args.cityId, context),
  },
};
