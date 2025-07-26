import { createTRPCRouter, baseProcedure } from "../../../trpc/init"
import { inngest } from "@/inngest/client"
import prisma from "@/lib/db"
import { z } from "zod"

export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
    .query(async () => {
        const messages = await prisma.message.findMany({
            orderBy: {
                updatedAt: "desc"
            }
        })
        return messages;
    }),
    create : baseProcedure
        .input(
            z.object({
                value: z.string()
                    .min(1, {message: "Prompt is Required"})
                    .max(10000, {message: "Prompt is too long"}),
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