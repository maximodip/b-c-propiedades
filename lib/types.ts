import { z } from "zod";

// Enums
export const PropertyTypeEnum = z.enum([
  "casa",
  "departamento",
  "terreno",
  "local",
  "oficina",
]);

export const PropertyStatusEnum = z.enum([
  "disponible",
  "vendida",
  "alquilada",
  "reservada",
]);

// Tipos exportados de Zod enums
export type PropertyType = z.infer<typeof PropertyTypeEnum>;
export type PropertyStatus = z.infer<typeof PropertyStatusEnum>;

// Esquema para Property
export const PropertySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "El título es requerido"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().positive("El precio debe ser positivo"),
  address: z.string().min(1, "La dirección es requerida"),
  type: PropertyTypeEnum,
  status: PropertyStatusEnum,
  bedrooms: z.number().int().nonnegative().nullable().optional(),
  bathrooms: z.number().int().nonnegative().nullable().optional(),
  area_size: z.number().positive().nullable().optional(),
  contact_email: z.string().email("Email inválido"),
  contact_phone: z.string().nullable().optional(),
  published_at: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Property = z.infer<typeof PropertySchema>;

// Esquema para crear propiedades
export const CreatePropertySchema = PropertySchema.omit({
  id: true,
  published_at: true,
  created_at: true,
  updated_at: true,
}).extend({
  status: PropertyStatusEnum.optional().default("disponible"),
});

export type CreateProperty = z.infer<typeof CreatePropertySchema>;

// Esquema para actualizar propiedades
export const UpdatePropertySchema = CreatePropertySchema.partial();

export type UpdateProperty = z.infer<typeof UpdatePropertySchema>;

// Esquema para PropertyImage
export const PropertyImageSchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  url: z.string().url("URL inválida"),
  storage_path: z.string(),
  is_main: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type PropertyImage = z.infer<typeof PropertyImageSchema>;

// Esquema para crear imágenes de propiedades
export const CreatePropertyImageSchema = PropertyImageSchema.omit({
  id: true,
  url: true,
  created_at: true,
  updated_at: true,
});

export type CreatePropertyImage = z.infer<typeof CreatePropertyImageSchema>;

// Esquema para consultas de propiedades
export const PropertyInquirySchema = z.object({
  id: z.string().uuid(),
  property_id: z.string().uuid(),
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().nullable().optional(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  read: z.boolean().default(false),
  created_at: z.string().datetime(),
});

export type PropertyInquiry = z.infer<typeof PropertyInquirySchema>;

// Esquema para crear consultas
export const CreatePropertyInquirySchema = PropertyInquirySchema.omit({
  id: true,
  read: true,
  created_at: true,
});

export type CreatePropertyInquiry = z.infer<typeof CreatePropertyInquirySchema>;

// Filtros para búsqueda de propiedades
export const PropertyFiltersSchema = z.object({
  type: PropertyTypeEnum.optional(),
  status: PropertyStatusEnum.optional(),
  min_price: z.number().positive().optional(),
  max_price: z.number().positive().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  min_area: z.number().positive().optional(),
  max_area: z.number().positive().optional(),
  search: z.string().optional(),
});

export type PropertyFilters = z.infer<typeof PropertyFiltersSchema>;

// Esquema para agentes inmobiliarios
export const UpsertAgentSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  photo_url: z.string().url("URL inválida").nullable().optional(),
});

export type UpsertAgent = z.infer<typeof UpsertAgentSchema>;
