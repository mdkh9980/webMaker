"use client"

import { useCurrentTheme } from "@/hooks/use-current-themes"
import { UserButton } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

interface Props {
    showName ?: boolean
}

export const UserControl = ({showName}: Props) => {
    const currentTheme = useCurrentTheme()
    return (
        <UserButton 
            showName={showName}
            appearance={{
                elements: {
                    userButtonAvatarBox: "rounded-md!",
                    userButtonBox: "rounded-md size-8!",
                    userButtonTrigger: "rounded-md!"
                },
                baseTheme: currentTheme === "dark" ? dark : undefined
            }}
        />
    )
}