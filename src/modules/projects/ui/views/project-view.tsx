"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageContainer } from "../components/messages-container";
import {
    ResizablePanel,
    ResizableHandle,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";

interface Props {
    projectId : string
}

const ProjectView = ({projectId} : Props) => {
    const trpc = useTRPC();
    console.log("From Project View : ", projectId)
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
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
                    <Suspense fallback={<p>Loading Project...</p>}>
                        <ProjectHeader projectId={projectId}/>
                    </Suspense>
                    <Suspense fallback={<p>Loading Messages ...</p>}>
                        <MessageContainer 
                            projectId={projectId}
                            activeFragment={activeFragment}
                            setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                >
                    {!!activeFragment && <FragmentWeb data={activeFragment}/>}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default ProjectView