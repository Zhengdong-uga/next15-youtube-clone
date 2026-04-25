import { z } from "zod";
import { eq, getTableColumns, inArray, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { subscriptions, users, videos } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usersRouter = createTRPCRouter({
  updateChannel: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1).max(100).optional(),
        description: z.string().max(5000).nullable().optional(),
        location: z.string().max(200).nullable().optional(),
        contactEmail: z.string().email().max(200).nullable().optional(),
        currentStatus: z.string().max(100).nullable().optional(),
        education: z.string().max(500).nullable().optional(),
        skills: z.array(z.string().trim().min(1).max(50)).max(20).optional(),
        links: z.array(z.object({
          title: z.string().trim().min(1).max(100),
          url: z.string().url().max(500),
        })).max(10).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [updated] = await db
        .update(users)
        .set({
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.location !== undefined ? { location: input.location } : {}),
          ...(input.contactEmail !== undefined ? { contactEmail: input.contactEmail } : {}),
          ...(input.currentStatus !== undefined ? { currentStatus: input.currentStatus } : {}),
          ...(input.education !== undefined ? { education: input.education } : {}),
          ...(input.skills !== undefined ? { skills: input.skills } : {}),
          ...(input.links !== undefined ? { links: input.links } : {}),
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { userId: ctxUserId } = ctx;
      const userId = ctxUserId ?? undefined;

      const viewerSubscriptions = db.$with("viewer_subscriptions").as(
        db
          .select()
          .from(subscriptions)
          .where(inArray(subscriptions.viewerId, userId ? [userId] : []))
      );

      const [existingUser] = await db
        .with(viewerSubscriptions)
        .select({
          ...getTableColumns(users),
          viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
          videoCount: db.$count(videos, eq(videos.userId, users.id)),
          subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
        })
        .from(users)
        .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
        .where(eq(users.id, input.id))

      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return existingUser;
    }),
});
