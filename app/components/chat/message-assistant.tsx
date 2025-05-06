// app/components/chat/message-assistant.tsx
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message"
import { cn } from "@/lib/utils"
import type { Message as MessageAISDK } from "@ai-sdk/react"
import { ArrowClockwise, Check, Copy } from "@phosphor-icons/react"
import { CalendarCard, CalendarEventData } from "./calendar-card" // <-- Import the CalendarCard component and type
import { getSources } from "./get-sources"
import { SourcesList } from "./sources-list"
import { ToolInvocation } from "./tool-invocation" // <-- Import ToolInvocation

type MessageAssistantProps = {
  children: string
  isLast?: boolean
  hasScrollAnchor?: boolean
  copied?: boolean
  copyToClipboard?: () => void
  onReload?: () => void
  parts?: MessageAISDK["parts"]
}

// Helper function to find calendar event data from tool invocation results
const findCalendarEvent = (parts?: MessageAISDK["parts"]): CalendarEventData | null => {
  if (!parts) return null;

  // Find the part corresponding to the 'scheduleEvent' tool call result
  const scheduleToolPart = parts.find(part =>
    part.type === 'tool-invocation' &&
    part.toolInvocation.toolName === 'scheduleEvent' &&
    // Check if the result exists (state could be 'result' or it might just have the result property)
    (part.toolInvocation.state === 'result' || (part.toolInvocation as any).result !== undefined)
  );

  if (scheduleToolPart && scheduleToolPart.type === 'tool-invocation') {
     const toolInvocation = scheduleToolPart.toolInvocation;

     // Check if the result object contains the event details
     // Adjust the path based on how your tool's `execute` function returns data
     if (toolInvocation.result?.success && toolInvocation.result?.eventDetails) {
       // Basic validation to ensure it looks like our event data
       const eventDetails = toolInvocation.result.eventDetails as any;
       if (eventDetails.title && eventDetails.date && eventDetails.startTime) {
           return eventDetails as CalendarEventData;
       }
     }
     // Alternative: Check if the arguments themselves hold the data (if execute just confirms)
     else if (toolInvocation.args) {
         const args = toolInvocation.args as any;
         if (args.title && args.date && args.startTime) {
            return args as CalendarEventData;
         }
     }
  }

  // --- Optional: Fallback for Structured JSON in Text (less reliable) ---
  /*
  const textPart = parts.find(part => part.type === 'text');
  if (textPart && textPart.type === 'text') {
    try {
      // Attempt to find and parse JSON matching the calendar event structure
      const jsonMatch = textPart.text.match(/{\s*"type"\s*:\s*"calendarEvent"[\s\S]*?}/);
      if (jsonMatch) {
        const potentialJson = JSON.parse(jsonMatch[0]);
        if (potentialJson.type === 'calendarEvent' && potentialJson.data) {
          // Add more validation if needed
          if (potentialJson.data.title && potentialJson.data.date && potentialJson.data.startTime) {
              return potentialJson.data as CalendarEventData;
          }
        }
      }
    } catch (e) {
      // Ignore JSON parsing errors
      console.warn("Could not parse potential calendar JSON in text:", e);
    }
  }
  */

  return null; // No valid calendar event data found
}


export function MessageAssistant({
  children,
  isLast,
  hasScrollAnchor,
  copied,
  copyToClipboard,
  onReload,
  parts,
}: MessageAssistantProps) {
  const sources = getSources(parts)
  const calendarEvent = findCalendarEvent(parts) // <-- Check for calendar data

  // Filter tool invocation parts, optionally excluding the scheduleEvent tool
  // if you handle it separately with the CalendarCard
  const toolInvocationParts = parts?.filter(
    (part) => part.type === "tool-invocation" && part.toolInvocation.toolName !== 'scheduleEvent'
  )

  const contentNullOrEmpty = children === null || children.trim() === ""

  return (
    <Message
      className={cn(
        // Use flex-col to stack elements vertically
        "group flex w-full max-w-3xl flex-col items-start gap-2 px-6 pb-2",
        hasScrollAnchor && "min-h-scroll-anchor"
      )}
    >
      {/* 1. Render Tool Invocations (excluding scheduleEvent if handled separately) */}
      {toolInvocationParts && toolInvocationParts.length > 0 && (
        <ToolInvocation data={toolInvocationParts} />
      )}

      {/* 2. Render the main text response if it exists */}
      {!contentNullOrEmpty && (
        <div className="flex w-full items-start gap-2"> {/* Keep text and actions horizontal */}
          <MessageContent
            className={cn(
              "prose dark:prose-invert relative min-w-0 flex-1 bg-transparent p-0", // Use flex-1 to allow actions to align right
              "prose-h1:scroll-m-20 prose-h1:text-2xl prose-h1:font-semibold prose-h2:mt-8 prose-h2:scroll-m-20 prose-h2:text-xl prose-h2:mb-3 prose-h2:font-medium prose-h3:scroll-m-20 prose-h3:text-base prose-h3:font-medium prose-h4:scroll-m-20 prose-h5:scroll-m-20 prose-h6:scroll-m-20 prose-strong:font-medium prose-table:block prose-table:overflow-y-auto"
            )}
            markdown={true}
          >
            {children}
          </MessageContent>
          <MessageActions
            className={cn(
              "flex gap-0 opacity-0 transition-opacity group-hover:opacity-100"
            )}
          >
            <MessageAction
              tooltip={copied ? "Copied!" : "Copy text"}
              side="bottom"
              delayDuration={0}
            >
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition"
                aria-label="Copy text"
                onClick={copyToClipboard}
                type="button"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </MessageAction>
            <MessageAction tooltip="Regenerate" side="bottom" delayDuration={0}>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition"
                aria-label="Regenerate"
                onClick={onReload}
                type="button"
              >
                <ArrowClockwise className="size-4" />
              </button>
            </MessageAction>
          </MessageActions>
        </div>
      )}

      {/* 3. Render Calendar Card if event data exists */}
      {calendarEvent && (
        <div className="w-full"> {/* Ensure card takes appropriate width */}
            <CalendarCard eventData={calendarEvent} />
        </div>
      )}

      {/* 4. Render Sources List */}
      {sources && sources.length > 0 && (
         <div className="w-full"> {/* Ensure sources list takes appropriate width */}
             <SourcesList sources={sources} />
         </div>
      )}

       {/* Add padding if it's the last message */}
       {isLast && <div className="pb-8"></div>}
    </Message>
  )
}
