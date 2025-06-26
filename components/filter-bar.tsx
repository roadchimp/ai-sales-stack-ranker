"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Filter } from "lucide-react"
import { useFilters } from "@/contexts/filter-context"
import { stages } from "@/lib/sample-data"

export function FilterBar() {
  const { filters, toggleStage, toggleRep, toggleRegion, clearFilters } = useFilters()

  const hasActiveFilters =
    filters.selectedStages.length > 0 || filters.selectedReps.length > 0 || filters.selectedRegions.length > 0

  const regions = ["Northeast", "SouthEast", "West", "Central"]
  const reps = ["Christopher Tucker", "Sarah Johnson", "Mike Chen", "Emily Davis"]

  return (
    <Card className="mb-6 card-enhanced border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Stage Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Stages:</span>
            {stages.map((stage) => (
              <Badge
                key={stage}
                variant={filters.selectedStages.includes(stage) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleStage(stage)}
              >
                {stage}
                {filters.selectedStages.includes(stage) && <X className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>

          {/* Region Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Regions:</span>
            {regions.map((region) => (
              <Badge
                key={region}
                variant={filters.selectedRegions.includes(region) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleRegion(region)}
              >
                {region}
                {filters.selectedRegions.includes(region) && <X className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>

          {/* Rep Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Reps:</span>
            {reps.map((rep) => (
              <Badge
                key={rep}
                variant={filters.selectedReps.includes(rep) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleRep(rep)}
              >
                {rep.split(" ")[0]}
                {filters.selectedReps.includes(rep) && <X className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
