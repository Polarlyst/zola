import { APP_DESCRIPTION } from "@/lib/config"
import React from "react"

export function AppInfoContent() {
  return (
    <div className="space-y-4">
      <p className="text-foreground leading-relaxed">
        {APP_DESCRIPTION} Demo by Invitrace.
      </p>
      <p className="text-foreground leading-relaxed">
        Contact {" "}
        <a
          href="https://www.linkedin.com/in/dhouch/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Us
        </a>
        . Made by{" "}
        <a
          href="https://www.linkedin.com/in/dhouch/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          @ibelick & @Pang
        </a>
        .
      </p>
    </div>
  )
}
