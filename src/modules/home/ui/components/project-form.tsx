import { z } from "zod"
import { toast } from "sonner"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import TextAreaAutoSize from "react-textarea-autosize"
import { ArrowUpIcon, Loader2Icon } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import {useClerk} from "@clerk/nextjs"
import { Form, FormField } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { PROJECT_TEMPLATES } from "../../constants"


const formSchema = z.object({
    value: z.string().min(1, {message: "Value is required"}).max(10000, {message: "Value is too long"})
})

export const ProjectForm = () => {
    const router = useRouter()
    const trpc = useTRPC()
    const clerk = useClerk()
    const queryClient = useQueryClient()
    const createProject = useMutation(trpc.projects.create.mutationOptions({
        onSuccess: (data) => {
            form.reset()
            queryClient.invalidateQueries(trpc.projects.getMany.queryOptions())
            queryClient.invalidateQueries(trpc.usage.status.queryOptions())
            router.push(`/projects/${data.id}`)
        },
        onError: (error) => {
            // Redirect to Pricing Page if specific error
            toast.error(error.message)
            if(error.data?.code === "UNAUTHORIZED"){
                clerk.openSignIn()
            }
            if(error.data?.code === "TOO_MANY_REQUESTS"){
                router.push("/pricing")
            }
        }
    }));
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: ""
        }
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createProject.mutateAsync({
            value: values.value,
        })
    }
    const onSelect = (value: string) => {
        form.setValue("value", value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }
    const [isFocused, setIsFocused] = useState(false)
    const isPending = createProject.isPending
    const isButtonDisabled = isPending || !(form.formState.isValid)
    return (
        <Form {...form}>
            <section className="space-y-6">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn(
                        "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
                        isFocused && "shadow-xs"
                    )}
                >
                    <FormField
                        control={form.control}
                        name="value"
                        render={({field}) => (
                            <TextAreaAutoSize
                                {...field}
                                disabled={isPending}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                minRows={2}
                                maxRows={8}
                                className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                                placeholder="What would you like to build?"
                                onKeyDown={(e) => {
                                    if(e.key === "Enter" && (e.ctrlKey || e.metaKey)){
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)(e);
                                    }
                                }}
                            />
                        )}
                    >
                    </FormField>
                    <div className="flex gap-x-2 items-end justify-between pt-2">
                        <div className="text-[10px] text-muted-foreground font-mono">
                            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-background">
                                <span>&#8984;</span>Enter
                            </kbd>
                            &nbsp;to submit
                        </div>
                        <Button 
                            disabled={isButtonDisabled}
                            className={cn("size-8 rounded-full", isButtonDisabled && "bg-muted-foreground border")}
                        >
                            {isPending ? (
                                <Loader2Icon className="size-4 animate-spin"/>
                            ) : (
                                <ArrowUpIcon />
                            )}
                        </Button>
                    </div>
                </form>
                <div>
                    {PROJECT_TEMPLATES.map((template) => (
                        <Button 
                            key={template.title}
                            size="sm"
                            variant="outline"
                            className="bg-white dark:bg-sidebar"
                            onClick={() => onSelect(template.prompt)}
                        >
                            {template.emoji} {template.title}
                        </Button>
                    ))}
                </div>
            </section>
        </Form>
    )
}