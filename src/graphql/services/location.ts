import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { Context } from "../../types/context";

export const LocationService = {
  getCountries: async ({ sellerId }: Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const countries = await prisma.country.findMany();

      if (!countries) {
        throw new ErrorService.NotFoundError("No hay países disponibles");
      }

      return countries;
    } catch (error) {
      throw new ErrorService.InternalServerError("Error al obtener los países");
    }
  },
  getRegionsByCountry: async (countryId: number, { sellerId }: Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      if (!countryId) throw new ErrorService.BadRequestError("No se proporcionó un ID de país válido");

      const parsedId = Number(countryId);
      const regions = await prisma.region.findMany({
        where: { countryId: parsedId },
      });

      if (!regions) {
        throw new ErrorService.NotFoundError("No hay regiones disponibles");
      }

      return regions;
    } catch (error) {
      throw new ErrorService.InternalServerError("Error al obtener las regiones");
    }
  },
  getCitiesByRegion: async (regionId: number, { sellerId }: Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      if (!regionId) throw new ErrorService.BadRequestError("No se proporcionó un ID de región válido");

      const parsedId = Number(regionId);
      const cities = await prisma.city.findMany({
        where: { regionId: parsedId },
      });

      if (!cities) {
        throw new ErrorService.NotFoundError("No hay ciudades disponibles");
      }

      return cities;
    } catch (error) {
      throw new ErrorService.InternalServerError("Error al obtener las ciudades");
    }
  },
  getCountiesByCity: async (cityId: number, { sellerId }: Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      if (!cityId) throw new ErrorService.BadRequestError("No se proporcionó un ID de ciudad válido");

      const parsedId = Number(cityId);
      const counties = await prisma.county.findMany({
        where: { cityId: parsedId },
      });

      if (!counties) {
        throw new ErrorService.NotFoundError("No hay comunas disponibles");
      }

      return counties;
    } catch (error) {
      throw new ErrorService.InternalServerError("Error al obtener las comunas");
    }
  },
};
