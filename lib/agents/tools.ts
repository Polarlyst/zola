// lib/agents/tools.ts
import { CalendarEventData } from "@/app/components/chat/calendar-card" // Import the type for calendar data
import { tool } from "ai"
import { z } from "zod"
import { generateReport } from "./tools/generateReport"
import { generateTitle } from "./tools/generateTitle"
import { planSearchQueries } from "./tools/planSearchQuery" // Assuming the file name is planSearchQuery.ts
import { searchWeb } from "./tools/searchWeb"
import { summarizeSources } from "./tools/summarizeSources"

// Define the Zod schema matching the CalendarEventData type for validation
const calendarEventSchema = z.object({
  title: z.string().describe("The title or summary of the event."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.").describe("The date of the event in YYYY-MM-DD format."),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format.").describe("The start time in HH:MM (24-hour) format."),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format.").optional().describe("The optional end time in HH:MM (24-hour) format."),
  description: z.string().optional().describe("An optional description for the event."),
  location: z.string().optional().describe("An optional location for the event."),
})

export const tools = {
  search: tool({
    description: "Search the web for information based on a query.",
    parameters: z.object({
      query: z.string().describe("The search query."),
    }),
    execute: async ({ query }) => {
      // Calls the implementation in ./tools/searchWeb.ts
      return await searchWeb(query)
    },
  }),

  planSearchQueries: tool({
    description: "Plan and generate a list of search queries based on the user's main prompt or topic.",
    parameters: z.object({
      prompt: z.string().describe("The user's main research prompt or topic."),
    }),
    execute: async ({ prompt }) => {
      // Calls the implementation in ./tools/planSearchQuery.ts
      return await planSearchQueries({ prompt })
    },
  }),

  generateTitle: tool({
    description: "Generate a concise and relevant title for a report based on the user's initial prompt.",
    parameters: z.object({
      prompt: z.string().describe("The user's initial prompt or topic for the report."),
    }),
    execute: async ({ prompt }) => {
      // Calls the implementation in ./tools/generateTitle.ts
      return await generateTitle(prompt)
    },
  }),

  summarizeSources: tool({
    description: "Summarize findings from a list of web search results, including citations.",
    parameters: z.object({
      searchResults: z
        .union([
          // Handles an array of search result sets
          z.array(
            z.object({
              query: z.string().describe("The original search query for these sources."),
              sources: z.array(
                z.object({
                  title: z.string().describe("The title of the web page."),
                  url: z.string().url().describe("The URL of the web page."),
                  snippet: z.string().describe("A short snippet or abstract from the web page."),
                })
              ).describe("An array of source objects found for the query."),
            })
          ),
          // Handles a single search result set (transforms it into an array)
          z
            .object({
              query: z.string().describe("The original search query for these sources."),
              sources: z.array(
                z.object({
                  title: z.string().describe("The title of the web page."),
                  url: z.string().url().describe("The URL of the web page."),
                  snippet: z.string().describe("A short snippet or abstract from the web page."),
                })
              ).describe("An array of source objects found for the query."),
            })
            .transform((item) => [item]),
        ])
        .transform((input) => (Array.isArray(input) ? input : [input])) // Ensures output is always an array
        .describe("An array containing sets of search results, where each set includes the query and its corresponding sources."),
    }),
    execute: async ({ searchResults }) => {
      // Calls the implementation in ./tools/summarizeSources.ts
      return await summarizeSources({ searchResults })
    },
  }),

  generateReport: tool({
    description: "Generate a final markdown report based on summarized findings and a title.",
    parameters: z.object({
      findings: z.array(
        z.object({
          query: z.string().describe("The query related to this summary."),
          summary: z.string().describe("The summarized text for this query, including citations."),
          // Citations might be included implicitly in the summary based on summarizeSources implementation
          // If citations need to be passed explicitly, add:
          // citations: z.array(
          //   z.object({
          //     title: z.string(),
          //     url: z.string().url(),
          //     snippet: z.string(),
          //   })
          // ).optional(),
        })
      ).describe("An array of summarized findings for different queries."),
      title: z.string().describe("The main title for the report."),
    }),
    execute: async ({ findings, title }) => {
      // Calls the implementation in ./tools/generateReport.ts
      return await generateReport({ findings, title })
    },
  }),

  scheduleEvent: tool({
      description: "Records a scheduled event or appointment in the calendar card UI. Use this *after* confirming the details with the user.",
      parameters: calendarEventSchema, // Use the schema defined above
      execute: async (eventData: CalendarEventData) => {
        // This tool primarily returns data for the UI.
        // It could potentially interact with a real calendar API here in the future.
        console.log("Tool 'scheduleEvent' executed with data:", eventData)
        return { success: true, eventDetails: eventData } // Return the structured data
      },
  })
}
