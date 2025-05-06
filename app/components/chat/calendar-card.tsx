import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CalendarBlank, Clock } from "@phosphor-icons/react"
import React from "react"

// Define the structure the LLM should ideally return
export type CalendarEventData = {
  title: string
  date: string // ISO format like "YYYY-MM-DD"
  startTime: string // 24-hour format like "HH:MM"
  endTime?: string // Optional, 24-hour format like "HH:MM"
  description?: string // Optional
  location?: string // Optional
}

type CalendarCardProps = {
  eventData: CalendarEventData
  className?: string
}

export function CalendarCard({ eventData, className }: CalendarCardProps) {
  const { title, date, startTime, endTime, description, location } = eventData

  const formatDate = (isoDate: string): string => {
    try {
      const d = new Date(isoDate + "T00:00:00") // Add time part to avoid timezone issues
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC", // Specify UTC to match ISO date input
      })
    } catch (e) {
      console.error("Error formatting date:", e)
      return isoDate // Fallback
    }
  }

  const formatTime = (timeString: string): string => {
    try {
      // Create a dummy date just to use time formatting
      const [hours, minutes] = timeString.split(":")
      const d = new Date()
      d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } catch (e) {
      console.error("Error formatting time:", e)
      return timeString // Fallback
    }
  }

  const timeDisplay = endTime
    ? `${formatTime(startTime)} - ${formatTime(endTime)}`
    : formatTime(startTime)

  return (
    <Card className={cn("my-4 w-full max-w-md overflow-hidden", className)}>
      <CardHeader className="bg-muted/50 flex flex-row items-center gap-3 space-y-0 p-4">
        <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
          <CalendarBlank weight="duotone" className="size-6" />
        </div>
        <div>
          <CardTitle className="text-base font-medium leading-tight">
            {title}
          </CardTitle>
          <p className="text-muted-foreground text-sm">{formatDate(date)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-2">
        <div className="text-foreground flex items-center gap-2 text-sm">
          <Clock className="text-muted-foreground size-4 shrink-0" />
          <span>{timeDisplay}</span>
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
        {location && (
          <p className="text-muted-foreground text-sm">
            <strong>Location:</strong> {location}
          </p>
        )}
        {/* Add more details or actions like "Add to Calendar" if needed */}
      </CardContent>
    </Card>
  )
}
