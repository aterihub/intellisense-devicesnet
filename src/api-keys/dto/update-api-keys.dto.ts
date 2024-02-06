import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

const UpdateApiKeysZ = z.object({
  expiresIn: z.string().optional(),
  isEnable: z.boolean().optional(),
  description: z.string().optional(),
});

export class UpdateApiKeysDto extends createZodDto(UpdateApiKeysZ) {}
