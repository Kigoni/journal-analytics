const ChartContainer = ({ children }) => {
  return <div className="w-full">{children}</div>
}

const Chart = ({ children }) => {
  return <>{children}</>
}

const ChartTooltip = ({ children }) => {
  return <>{children}</>
}

const ChartTooltipContent = () => {
  return <></>
}

const ChartLegend = ({ children }) => {
  return <div className="flex items-center gap-2">{children}</div>
}

const ChartLegendItem = ({ name, color }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
      <span>{name}</span>
    </div>
  )
}

export { ChartContainer, Chart, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }

