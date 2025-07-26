"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageContainer } from "../components/messages-container";
import {
    ResizablePanel,
    ResizableHandle,
    ResizablePanelGroup
} from "@/components/ui/resizable"

interface Props {
    projectId : string
}

const ProjectView = ({projectId} : Props) => {
    const trpc = useTRPC();
    const {data : project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId
    }))
    const {data : messages}  = useSuspenseQuery(trpc.messages.getMany.queryOptions({
        projectId: projectId
    }))
    return (
        <div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel 
                    defaultSize={35}
                    minSize={20}
                    className="flex flex-col min-h-0"
                >
                    <MessageContainer projectId={projectId}/>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    Todo : Preview
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default ProjectView