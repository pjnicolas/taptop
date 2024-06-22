import { Button } from '@mantine/core'
import { GradeColor } from '@/utils/types'

interface Props {
  onClick: (color: GradeColor) => void
}

const GradeSelector = ({ onClick }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {Object.values(GradeColor).map((color) => (
        <Button
          key={color}
          size="xl"
          color={color}
          onClick={() => onClick(color)}
        >
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </Button>
      ))}
    </div>
  )
}

export default GradeSelector
