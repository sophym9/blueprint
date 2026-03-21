import type { RegionCategory } from '../types/map'

interface FilterBarProps {
  categories: RegionCategory[]
  selectedCategories: RegionCategory[]
  counts: Partial<Record<RegionCategory, number>>
  onToggle: (category: RegionCategory) => void
  onReset: () => void
}

const categoryLabels: Record<RegionCategory, string> = {
  academic: 'Academic',
  housing: 'Housing',
  landmark: 'Landmark',
  recreation: 'Recreation',
  event: 'Event',
  parking: 'Parking',
}

export function FilterBar({
  categories,
  selectedCategories,
  counts,
  onToggle,
  onReset,
}: FilterBarProps) {
  return (
    <section className="filter-bar">
      <div>
        <p className="eyebrow">Filters</p>
        <h2>Explore Duke by category</h2>
      </div>

      <div className="filter-actions">
        {categories.map((category) => {
          const selected = selectedCategories.includes(category)

          return (
            <button
              key={category}
              type="button"
              className={selected ? 'filter-chip active' : 'filter-chip'}
              onClick={() => onToggle(category)}
            >
              <span>{categoryLabels[category]}</span>
              <span className="chip-count">{counts[category] ?? 0}</span>
            </button>
          )
        })}

        <button type="button" className="filter-reset" onClick={onReset}>
          Reset view
        </button>
      </div>
    </section>
  )
}
