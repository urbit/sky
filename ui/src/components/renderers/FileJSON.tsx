import { useState, useCallback } from 'react'
import useWindowStore from '../../state/useWindowStore'
import { debounce } from 'lodash'
import { put } from '../../api/sky'

interface FileJSONProps {
  json: JSON
}

export default function FileJSON({ json }: FileJSONProps): JSX.Element {
  const jsonData = Array.isArray(json) ? json : [json]
  const [sortedData, setSortedData] = useState(jsonData)
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' for ascending, 'desc' for descending
  const [sortColumn, setSortColumn] = useState('')
  const [editCell, setEditCell] = useState({ row: 0, key: '' })
  const { activeWindowPath } = useWindowStore()
  const [path, setPath] = useState<string | null>('')

  const handleSort = (column: string) => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(direction)

    const sorted = [...sortedData].sort((a, b) => {
      const aValue = a[column]
      const bValue = b[column]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return direction === 'asc' ? aValue - bValue : bValue - aValue
    })

    return sorted
  }

  const handleClickSort = (column: string) => {
    const sorted = handleSort(column)
    setSortedData(sorted)
  }

  const handleClickCell = (index: number, key: string) => {
    setEditCell({ row: index, key: key })
  }

  const handleCellChange = (value: string) => {
    const updatedData = [...sortedData]
    updatedData[editCell.row][editCell.key] = value
    setSortedData(updatedData)
    setPath(activeWindowPath)
    console.log('data updated', updatedData)
  }

  const handleSubmitCell = useCallback(
    debounce(async () => {
      if (activeWindowPath) {
        const formData = new FormData()
        //  Sorting data by the first key before uploading
        setSortDirection('desc')
        const data = handleSort(Object.keys(sortedData[0])[0])

        const file = new File([JSON.stringify(data)], 'file.json', {
          type: 'application/json',
        })
        console.log('updating data to ', file)
        formData.append('file', file)
        console.log('form data', formData)

        try {
          await put(activeWindowPath, formData)
          console.log('Upload successful')
        } catch (error) {
          console.error('Upload failed:', error)
        }
      }
    }, 500),
    [activeWindowPath]
  )

  const handleBlur = () => {
    //  Prevents JSON file from being saved to unintended path,
    //  if different window gained focus after blur event occured.
    console.log('paths', path, activeWindowPath)
    if (path === activeWindowPath) {
      console.log('handle Blur')
      setEditCell({ row: 0, key: '' })
      handleSubmitCell()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('handle keydown Enter')
      setEditCell({ row: 0, key: '' })
      handleSubmitCell()
    }
  }

  return (
    <div className="hf wf">
      <table>
        <thead>
          <tr>
            {Object.keys(sortedData[0]).map(key => (
              <th
                key={key}
                className="pointer"
                onClick={() => handleClickSort(key)}
              >
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
                  <td
                    key={key}
                    className="pointer"
                    onClick={() => {
                      handleClickCell(index, key)
                    }}
                  >
                    {editCell.row === index && editCell.key === key ? (
                      <input
                        autoFocus
                        type="text"
                        //className="wf"
                        value={row[key]}
                        onChange={e => {
                          handleCellChange(e.target.value)
                        }}
                        onBlur={() => {
                          handleBlur()
                        }}
                        onKeyDown={(
                          e: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          handleKeyDown(e)
                        }}
                      />
                    ) : (
                      row[key]
                    )}
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
