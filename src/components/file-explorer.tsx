import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useEffect, useCallback, Fragment, useMemo } from "react";

import { Hint } from "./hint";
import { Button } from "./ui/button";
import { Codeview } from "./code-view";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/components/ui/breadcrumb"
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tree-view";

type FileCollection = {[path:string] : string}

function getLanguageFromExtension(filename:string) : string {
    const extension = filename.split(".").pop()?.toLowerCase()
    return extension || "text"
}

interface FileBreadCrumbsProps {
    filePath : string
}

const FileBreadCrumb = ({filePath}: FileBreadCrumbsProps) => {
    const pathSegments = filePath.split("/")
    const maxSegments = 4

    const renderBreadCrumbsItems = () => {
        if(pathSegments.length <= maxSegments){
            return pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                
                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {isLast ? (
                                <BreadcrumbPage className="font-medium">
                                    {segment}
                                </BreadcrumbPage>
                            ) : (
                                <span className="text-muted-foreground">
                                    {segment}
                                </span>
                            )}
                        </BreadcrumbItem>
                        {isLast && <BreadcrumbSeparator />}
                    </Fragment>
                )
            })
        } else {
            const firstSegment = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length - 1];
            return (
                <>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground">
                            {firstSegment}
                        </span>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbEllipsis/>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">
                                {lastSegment}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbItem>
                </>
            )
        }
    }
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {renderBreadCrumbsItems()}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

interface FileExplorerProps {
    files: FileCollection
}

export const FileExplorer = ({files} : FileExplorerProps) => {
    const [copied,setCopied] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string | null>(() => {
        const fileKeys = Object.keys(files)
        return fileKeys.length > 0 ? fileKeys[0] : null
    })

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files)
    }, [files])

    const handleFileSelect = useCallback((filePath: string) => {
        if(files[filePath]){
            setSelectedFiles(filePath)
        }
    }, [files])

    const handleCopy = useCallback(() => {
        if(selectedFiles){
            navigator.clipboard.writeText(files[selectedFiles])
            setCopied(true);
            setTimeout(() => {
                setCopied(false)
            }, 2000)

        }
    }, [selectedFiles, files])

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
                <TreeView
                    data={treeData}
                    value={selectedFiles}
                    onSelect={handleFileSelect}
                />
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary transition-colors"/>
            <ResizablePanel defaultSize={70} minSize={50}>
                {selectedFiles && files[selectedFiles] ? (
                    <div className="h-full w-full flex flex-col">
                        <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                            <FileBreadCrumb filePath={selectedFiles}/>
                            <Hint text="Copy to Clipboard" side="bottom">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="ml-auto"
                                    onClick={handleCopy}
                                    disabled={copied}
                                >
                                    {copied ? <CopyCheckIcon /> :<CopyIcon />}
                                </Button>
                            </Hint>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <Codeview code={files[selectedFiles]} lang={getLanguageFromExtension(selectedFiles)}/>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Select a file to view it&apos;s content
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}