import { prisma } from "../db.js";
import { toIso } from "../utils/serialize.js";
import { USER_ROLE_SLUGS, CERTIFICATION_LEVEL_SLUGS } from "@mandate/shared";
import type { User } from "@mandate/shared";

export class UserNotFoundError extends Error {}
export class UserConflictError extends Error {}

function mapUser(u: {
  id: string;
  name: string;
  email: string;
  role: string;
  certificationLevel: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    certificationLevel: u.certificationLevel,
    isActive: u.isActive,
    createdAt: toIso(u.createdAt),
    updatedAt: toIso(u.updatedAt),
  };
}

/** Active users first (they're the ones you'd assign new work to), then alphabetical by name. */
export async function listUsers(): Promise<User[]> {
  const rows = await prisma.user.findMany({ orderBy: [{ isActive: "desc" }, { name: "asc" }] });
  return rows.map(mapUser);
}

export interface CreateUserInput {
  name: string;
  email: string;
  role?: string;
  certificationLevel?: string;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  if (!input.name.trim()) throw new RangeError("name is required");
  if (!input.email.trim()) throw new RangeError("email is required");
  if (input.role !== undefined && !USER_ROLE_SLUGS.includes(input.role)) {
    throw new RangeError(`role must be one of ${USER_ROLE_SLUGS.join(", ")}, got "${input.role}"`);
  }
  if (input.certificationLevel !== undefined && !CERTIFICATION_LEVEL_SLUGS.includes(input.certificationLevel)) {
    throw new RangeError(`certificationLevel must be one of ${CERTIFICATION_LEVEL_SLUGS.join(", ")}, got "${input.certificationLevel}"`);
  }

  try {
    const row = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        role: input.role ?? "researcher",
        certificationLevel: input.certificationLevel ?? "new_researcher",
      },
    });
    return mapUser(row);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      throw new UserConflictError(`A user with email "${input.email}" already exists.`);
    }
    throw err;
  }
}

export interface UpdateUserInput {
  name?: string;
  role?: string;
  certificationLevel?: string;
  isActive?: boolean;
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  if (input.role !== undefined && !USER_ROLE_SLUGS.includes(input.role)) {
    throw new RangeError(`role must be one of ${USER_ROLE_SLUGS.join(", ")}, got "${input.role}"`);
  }
  if (input.certificationLevel !== undefined && !CERTIFICATION_LEVEL_SLUGS.includes(input.certificationLevel)) {
    throw new RangeError(`certificationLevel must be one of ${CERTIFICATION_LEVEL_SLUGS.join(", ")}, got "${input.certificationLevel}"`);
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new UserNotFoundError(`User "${id}" not found`);

  const row = await prisma.user.update({
    where: { id },
    data: {
      name: input.name,
      role: input.role,
      certificationLevel: input.certificationLevel,
      isActive: input.isActive,
    },
  });
  return mapUser(row);
}
