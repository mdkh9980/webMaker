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
                value: z.string().min(1, {message: "Message is Required"}),
            }),
        )
        .mutation(async ({input}) => {
            const createdMessage = await prisma.message.create({
                data: {
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                }
            })
            await inngest.send({
                name: "codeAgent/run",
                data: {
                    value: input.value
                }
            })
            return createdMessage
        })
})