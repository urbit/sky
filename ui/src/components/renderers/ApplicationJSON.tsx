import { useState } from 'react'

interface ApplicationJSONProps {
  json: JSON
}

export default function ApplicationJSON({
  json,
}: ApplicationJSONProps): JSX.Element {
  console.log('rendering ', json)

  const jsonData = Array.isArray(json) ? json : [json]
  const [sortedData, setSortedData] = useState(jsonData)
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' for ascending, 'desc' for descending
  const [sortColumn, setSortColumn] = useState('')

  const handleSort = (column: string) => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(direction)

    const sorted = [...jsonData].sort((a, b) => {
      const aValue = a[column]
      const bValue = b[column]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return direction === 'asc' ? aValue - bValue : bValue - aValue
    })

    setSortedData(sorted)
  }

  return (
    <div className="hf wf fr as jc">
      <table>
        <thead>
          <tr>
            {Object.keys(sortedData[0]).map(key => (
              <th key={key} className="pointer" onClick={() => handleSort(key)}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map(key =>
                row ? (
                  <td key={key} style={{ cursor: 'default' }}>
                    {row[key]}
                  </td>
                ) : null
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
