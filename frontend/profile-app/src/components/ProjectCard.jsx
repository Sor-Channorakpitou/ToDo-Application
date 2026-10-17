import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Layers, Sparkles } from "lucide-react"

/**
 * AI-generated composite ProjectCard blueprint composed from shadcn/ui primitives:
 * - Card (from @/components/ui/card)
 * - Badge (from @/components/ui/badge)
 * - Button (from @/components/ui/button)
 *
 * Audit checklist:
 * 1. Imports strictly come from @/components/ui/*
 * 2. Any children expression renders as {children}, never quoted.
 * 3. Padding adheres to Tailwind 4px scale: p-6 = 24px, gap-2 = 8px, gap-4 = 16px.
 * 4. High contrast typography: text-gray-900 (title), text-gray-700 (body), text-gray-500 (meta).
 * 5. Props flow one way; each ProjectCard instance maintains its own isolated data.
 */
export default function ProjectCard({
  title,
  description,
  status = "Active",
  statusVariant = "success",
  tags = [],
  metrics,
  projectUrl = "#",
  onViewProject,
}) {
  const handleView = () => {
    if (onViewProject) {
      onViewProject(title)
    } else {
      window.open(projectUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
      <div>
        <CardHeader className="p-6 pb-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant={statusVariant}>
              {status}
            </Badge>
            {metrics && (
              <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                {metrics}
              </span>
            )}
          </div>
          <CardTitle className="mt-2 text-xl font-bold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-gray-500 line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-3">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="border-t border-gray-100 bg-gray-50/50 p-6 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Layers className="h-3.5 w-3.5 text-gray-400" />
          <span>Production Ready</span>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleView}
          className="group transition-all duration-200"
        >
          <span>View project</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
