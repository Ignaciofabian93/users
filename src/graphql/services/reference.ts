import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";

export const ReferenceService = {
  sellerReference: async ({ id }: { id: string }) => {
    try {
      const seller = await prisma.seller.findUnique({
        where: { id },
      });
      if (!seller) {
        throw new ErrorService.NotFoundError("Usuario no encontrado");
      }
      return seller;
    } catch (error) {
      console.error("Error fetching seller by ID:", error);
      throw new ErrorService.InternalServerError("Error al obtener el usuario por ID");
    }
  },
};
