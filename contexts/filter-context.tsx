"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface FilterState {
  selectedStages: string[]
  selectedReps: string[]
  selectedRegions: string[]
  dateRange: {
    start: string
    end: string
  }
}

interface FilterContextType {
  filters: FilterState
  setFilters: (filters: Partial<FilterState>) => void
  toggleStage: (stage: string) => void
  toggleRep: (rep: string) => void
  toggleRegion: (region: string) => void
  clearFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

const initialFilters: FilterState = {
  selectedStages: [],
  selectedReps: [],
  selectedRegions: [],
  dateRange: {
    start: "",
    end: "",
  },
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(initialFilters)

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }

  const toggleStage = (stage: string) => {
    setFiltersState((prev) => ({
      ...prev,
      selectedStages: prev.selectedStages.includes(stage)
        ? prev.selectedStages.filter((s) => s !== stage)
        : [...prev.selectedStages, stage],
    }))
  }

  const toggleRep = (rep: string) => {
    setFiltersState((prev) => ({
      ...prev,
      selectedReps: prev.selectedReps.includes(rep)
        ? prev.selectedReps.filter((r) => r !== rep)
        : [...prev.selectedReps, rep],
    }))
  }

  const toggleRegion = (region: string) => {
    setFiltersState((prev) => ({
      ...prev,
      selectedRegions: prev.selectedRegions.includes(region)
        ? prev.selectedRegions.filter((r) => r !== region)
        : [...prev.selectedRegions, region],
    }))
  }

  const clearFilters = () => {
    setFiltersState(initialFilters)
  }

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        toggleStage,
        toggleRep,
        toggleRegion,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}
