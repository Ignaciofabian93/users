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
      console.log("[SellerReference] Fetching seller reference for ID:", id);
      const seller = await prisma.seller.findUnique({
        where: { id },
        include: {
          personProfile: true,
          businessProfile: true,
          country: true,
          region: true,
          city: true,
          county: true,
          sellerLevel: true,
        },
      });

      if (!seller) {
        console.warn("[SellerReference] Seller not found for ID:", id);
        return null;
      }

      console.log("[SellerReference] Seller found:", {
        id: seller.id,
        email: seller.email,
        sellerType: seller.sellerType,
        hasPersonProfile: !!seller.personProfile,
        hasBusinessProfile: !!seller.businessProfile,
        hasCountry: !!seller.country,
        hasCity: !!seller.city,
      });

      return seller;
    } catch (error) {
      console.error("[SellerReference] Error fetching seller by ID:", id, error);
      return null;
    }
  },
};
