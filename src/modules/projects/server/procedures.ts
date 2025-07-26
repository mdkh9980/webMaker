import { createTRPCRouter, baseProcedure } from "../../../trpc/init"
import { inngest } from "@/inngest/client"
import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db"
import { z } from "zod"
import { TRPCError } from "@trpc/server"

export const projectRouter = createTRPCRouter({
    getOne: baseProcedure
    .input(
        z.object({
            id: z.string().min(1, "Project Id is required")
        })
    )
    .query(async ({input}) => {
        const existingProject = await prisma.project.findUnique({
            where: {
                id: input.id
            }
        })
        if(!existingProject){
            throw new TRPCError({code: "NOT_FOUND", message: "Project not found"})
        }
        return existingProject;
    }),
    getMany: baseProcedure
    .query(async () => {
        const projects = await prisma.project.findMany({
            orderBy: {
                updatedAt: "desc"
            }
        })
        return projects;
    }),
    create : baseProcedure
        .input(
            z.object({
                value: z.string()
                        .min(1, {message: "Prompt is Required"})
                        .max(10000, {message: "Prompt is too long"})
            }),
        )
        .mutation(async ({input}) => {
            const createdProject = await prisma.project.create({
                data: {
                    name: generateSlug(2, {
                        format: "kebab"
                    }),
                    messages : {
                        create : {
                            content: input.value,
                            role: "USER",
                            type: "RESULT",
                        }
                    }
                }
            })
            await inngest.send({
                name: "codeAgent/run",
                data: {
                    value: input.value,
                    projectId : createdProject.id
                }
            })
            return createdProject
        })
})