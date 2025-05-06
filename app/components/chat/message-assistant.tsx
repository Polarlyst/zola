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
import { CalendarCard, CalendarEventData } from "./calendar-card"
import { getSources } from "./get-sources"
import { SourcesList } from "./sources-list"
import { ToolInvocation as ToolInvocationComponent } from "./tool-invocation"

// Define a helper type for a single part element from the 'parts' array
type MessagePart = NonNullable<MessageAISDK["parts"]>[number];

type MessageAssistantProps = {
  children: string
  isLast?: boolean
  hasScrollAnchor?: boolean
  copied?: boolean
  copyToClipboard?: () => void
  onReload?: () => void
  parts?: MessageAISDK["parts"]
}

// Type predicate function - Check if the part is a tool invocation
function isToolInvocationPart(part: MessagePart): part is Extract<MessagePart, { type: 'tool-invocation' }> {
  // Check if the part has a 'toolInvocation' property before accessing it
  return part.type === 'tool-invocation' && 'toolInvocation' in part && part.toolInvocation != null;
}

// Helper function to find calendar event data from tool invocation results
const findCalendarEvent = (parts?: MessageAISDK["parts"]): CalendarEventData | null => {
  if (!parts) return null;

  const scheduleToolPart = parts.find(part =>
    part.type === 'tool-invocation' &&
    part.toolInvocation?.toolName === 'scheduleEvent' &&
    part.toolInvocation?.state === 'result'
  );

  if (scheduleToolPart?.type === 'tool-invocation' && scheduleToolPart.toolInvocation?.state === 'result') {
     const toolInvocation = scheduleToolPart.toolInvocation;

     if (toolInvocation.result?.success && toolInvocation.result?.eventDetails) {
       const eventDetails = toolInvocation.result.eventDetails as any;
       if (eventDetails.title && eventDetails.date && eventDetails.startTime) {
           return eventDetails as CalendarEventData;
       }
     }
     else if (toolInvocation.args) {
         const args = toolInvocation.args as any;
         if (args.title && args.date && args.startTime) {
            return args as CalendarEventData;
         }
     }
  }
  return null;
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
  const calendarEvent = findCalendarEvent(parts)

  // Filter tool invocation parts *other than* scheduleEvent using the type predicate
  // Ensure parts exists before filtering
  const otherToolInvocationParts = parts
    ?.filter(isToolInvocationPart) // Use the refined type predicate
    ?.filter(part => part.toolInvocation.toolName !== 'scheduleEvent'); // Now safe to access toolInvocation

  const contentNullOrEmpty = children === null || children.trim() === ""

  return (
    <Message
      className={cn(
        "group flex w-full max-w-3xl flex-col items-start gap-2 px-6 pb-2",
        hasScrollAnchor && "min-h-scroll-anchor"
      )}
    >
      {/* 1. Render other Tool Invocations */}
      {otherToolInvocationParts && otherToolInvocationParts.length > 0 && (
        // Pass the filtered parts - type should be correctly narrowed now
        <ToolInvocationComponent data={otherToolInvocationParts} />
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
