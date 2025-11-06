import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";

export const ReferenceService = {
  adminReference: async ({ id }: { id: string }) => {
    try {
      console.log("[AdminReference] Fetching admin reference for ID:", id);
      const admin = await prisma.admin.findUnique({
        where: { id },
        include: {
          city: true,
          country: true,
          county: true,
          region: true,
        },
      });

      if (!admin) {
        console.warn("[AdminReference] Admin not found for ID:", id);
        // Return null to allow the field to be nullable
        // This prevents the entire query from failing
        return null;
      }

      console.log("[AdminReference] Admin found:", {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      });

      return admin;
    } catch (error) {
      console.error("[AdminReference] Error fetching admin by ID:", id, error);
      // Return null instead of throwing to prevent breaking the entire query
      return null;
    }
  },

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
