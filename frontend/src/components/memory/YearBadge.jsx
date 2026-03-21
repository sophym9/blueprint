const YEAR_COLORS = {
  freshman: { bg: '#4ADE80', text: '#052e16' },
  sophomore: { bg: '#FACC15', text: '#1c1917' },
  junior: { bg: '#FB923C', text: '#1c1917' },
  senior: { bg: '#003087', text: '#ffffff' },
}

export default function YearBadge({ year }) {
  if (!year) return null
  const colors = YEAR_COLORS[year] || { bg: '#C9A84C', text: '#0A0E1A' }
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        fontSize: '10px',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '999px',
        fontFamily: "'DM Sans', sans-serif",
        textTransform: 'capitalize',
        letterSpacing: '0.05em',
      }}
    >
      {year}
    </span>
  )
}
