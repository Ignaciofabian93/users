import { Context } from "../../types/context";
import { LocationService } from "../services/location";

export const LocationResolver = {
  Query: {
    countries: (_parent: unknown, _args: unknown, context: Context) => LocationService.getCountries(context),
    regionsByCountryId: (_parent: unknown, _args: { countryId: number }, context: Context) =>
      LocationService.getRegionsByCountry(_args.countryId, context),
    citiesByRegionId: (_parent: unknown, _args: { regionId: number }, context: Context) =>
      LocationService.getCitiesByRegion(_args.regionId, context),
    countiesByCityId: (_parent: unknown, _args: { cityId: number }, context: Context) =>
      LocationService.getCountiesByCity(_args.cityId, context),
  },
};
