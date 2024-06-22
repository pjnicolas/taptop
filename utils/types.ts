export enum GradeColor {
  blue = 'blue',
  green = 'green',
  orange = 'orange',
  yellow = 'yellow',
  purple = 'purple',
  red = 'red',
  black = 'black',
}

export interface Day {
  date: string
  newSends: { [key in GradeColor]: number }
  repeatedSends: { [key in GradeColor]: number }
}
