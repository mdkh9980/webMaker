import { createTRPCRouter, baseProcedure } from "../../../trpc/init"
import { inngest } from "@/inngest/client"
import prisma from "@/lib/db"
import { z } from "zod"

export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
    .input(
        z.object({
            projectId: z.string().min(1, {message: "Project ID is required"})
        })
    )
    .query(async ({input}) => {
        const messages = await prisma.message.findMany({
            where: {
                projectId: input.projectId
            },
            include: {
                fragment: true
            },
            orderBy: {
                updatedAt: "asc"
            }
        })
        return messages;
    }),
    create : baseProcedure
        .input(
            z.object({
                value: z.string().min(1, {message: "Value is required"}).max(10000, {message: "Value is too long"}),
                projectId : z.string()
            }),
        )
        .mutation(async ({input}) => {
            const createdMessage = await prisma.message.create({
                data: {
                    projectId: input.projectId,
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                }
            })
            await inngest.send({
                name: "codeAgent/run",
                data: {
                    value: input.value,
                    projectId: input.value
                }
            })
            return createdMessage
        })
})