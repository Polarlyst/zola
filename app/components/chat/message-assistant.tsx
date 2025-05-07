// app/components/chat/message-assistant.tsx
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message"
import { cn } from "@/lib/utils"// app/components/chat/message-assistant.tsx
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message"
import { cn } from "@/lib/utils"
import type { Message as MessageAISDK } from "@ai-sdk/react"
// NOTE: Do not import ToolInvocation type directly if it causes errors.
// We will rely on the structure within MessageAISDK['parts'].
import { ArrowClockwise, Check, Copy } from "@phosphor-icons/react"
import { CalendarCard, CalendarEventData } from "./calendar-card"
import { getSources } from "./get-sources"
import { SourcesList } from "./sources-list"
// Ensure this import points to your *rendering* component, not a type
import { ToolInvocation as ToolInvocationComponent } from "./tool-invocation"

// Define a helper type for a single part element from the 'parts' array
// This handles the case where 'parts' might be undefined.
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
// Uses Extract to correctly narrow down the union type
function isToolInvocationPart(part: MessagePart): part is Extract<MessagePart, { type: 'tool-invocation' }> {
  // Check the type property and existence of toolInvocation object
  return part.type === 'tool-invocation' && typeof part.toolInvocation === 'object' && part.toolInvocation !== null;
}

// Helper function to find calendar event data from tool invocation results
const findCalendarEvent = (parts?: MessageAISDK["parts"]): CalendarEventData | null => {
  if (!parts) return null;

  // Find the part corresponding to the 'scheduleEvent' tool call result
  const scheduleToolPart = parts.find(part =>
    part.type === 'tool-invocation' &&
    part.toolInvocation?.toolName === 'scheduleEvent' &&
    part.toolInvocation?.state === 'result' // Check the state safely
  );

  // Check if the part exists and is the correct type *with* the result state
  if (scheduleToolPart?.type === 'tool-invocation' && scheduleToolPart.toolInvocation?.state === 'result') {
     // Access the nested toolInvocation object - TS knows it exists and state is 'result'
     const toolInvocation = scheduleToolPart.toolInvocation;

     // Safely access .result because state is 'result'
     if (toolInvocation.result?.success && toolInvocation.result?.eventDetails) {
       const eventDetails = toolInvocation.result.eventDetails as any;
       // Basic validation
       if (eventDetails.title && eventDetails.date && eventDetails.startTime) {
           return eventDetails as CalendarEventData;
       }
     }
     // Alternative check: data might be in args if execute function doesn't modify it
     else if (toolInvocation.args) {
         const args = toolInvocation.args as any;
         if (args.title && args.date && args.startTime) {
            return args as CalendarEventData;
         }
     }
  }
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

  // ***** DEBUG LOGGING - Keep this for testing *****
  if (children?.includes("เรียบร้อยแล้วค่ะ")) { // Example condition, adjust if needed
    console.log("--- Assistant Message Parts (Confirmation) ---");
    console.log(JSON.stringify(parts, null, 2)); // Log the raw parts data
  }
  // ***** END DEBUG LOGGING *****

  const sources = getSources(parts);
  const calendarEvent = findCalendarEvent(parts); // Find calendar data

  // Filter tool invocation parts *other than* scheduleEvent, using the type predicate
  const otherToolInvocationParts = parts
    ?.filter(isToolInvocationPart) // Filter for tool invocations first
    ?.filter(part => part.toolInvocation.toolName !== 'scheduleEvent'); // Then filter out scheduleEvent

  const contentNullOrEmpty = children === null || children.trim() === "";

  return (
    <Message
      className={cn(
        // Use flex-col to stack child elements vertically
        "group flex w-full max-w-3xl flex-col items-start gap-2 px-6 pb-2",
        hasScrollAnchor && "min-h-scroll-anchor"
      )}
    >
      {/* 1. Render other Tool Invocations (if any) */}
      {otherToolInvocationParts && otherToolInvocationParts.length > 0 && (
        // Pass the correctly typed array to the component
        <ToolInvocationComponent data={otherToolInvocationParts} />
      )}

      {/* 2. Render the main text response (if it exists) */}
      {!contentNullOrEmpty && (
        <div className="flex w-full items-start gap-2"> {/* Wrapper to keep text + actions together */}
          <MessageContent
            className={cn(
              "prose dark:prose-invert relative min-w-0 flex-1 bg-transparent p-0", // flex-1 allows actions to align right
              "prose-h1:scroll-m-20 prose-h1:text-2xl prose-h1:font-semibold prose-h2:mt-8 prose-h2:scroll-m-20 prose-h2:text-xl prose-h2:mb-3 prose-h2:font-medium prose-h3:scroll-m-20 prose-h3:text-base prose-h3:font-medium prose-h4:scroll-m-20 prose-h5:scroll-m-20 prose-h6:scroll-m-20 prose-strong:font-medium prose-table:block prose-table:overflow-y-auto"
            )}
            markdown={true}
          >
            {children}
          </MessageContent>
          <MessageActions
            className={cn(
              "flex gap-0 opacity-0 transition-opacity group-hover:opacity-100" // Actions appear on hover
            )}
          >
            <MessageAction
              tooltip={copied ? "Copied!" : "Copy text"}
              side="bottom"
              delayDuration={0}
            >
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition hover:bg-muted"
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
                className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition hover:bg-muted"
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

      {/* 3. Render Calendar Card if event data was found */}
      {calendarEvent && (
        <div className="w-full max-w-md self-start"> {/* Align card left, control width */}
            <CalendarCard eventData={calendarEvent} />
        </div>
      )}

      {/* 4. Render Sources List (if any) */}
      {sources && sources.length > 0 && (
         <div className="w-full">
             <SourcesList sources={sources} />
         </div>
      )}

       {/* Add padding if it's the last message in the conversation */}
       {isLast && <div className="pb-8"></div>}
    </Message>
  );
}
