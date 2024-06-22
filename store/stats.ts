import { getToday } from '@/utils/time'
import { Day, GradeColor } from '@/utils/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StatsState {
  days: Day[]
  wipeAll: () => void
  addMockStats: () => void
  getToday: () => Day
  getTwoWeeks: () => Day[]
  addNewSend: (grade: GradeColor) => void
  addRepeatedSend: (grade: GradeColor) => void
}

const createToday = () => {
  return {
    date: getToday(),
    newSends: Object.values(GradeColor).reduce(
      (acc, grade) => ({
        ...acc,
        [grade]: 0,
      }),
      {} as { [key in GradeColor]: number }
    ),
    repeatedSends: Object.values(GradeColor).reduce(
      (acc, grade) => ({
        ...acc,
        [grade]: 0,
      }),
      {} as { [key in GradeColor]: number }
    ),
  }
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      days: [],

      wipeAll: () => set({ days: [] }),

      addMockStats: () => {
        const today = new Date()
        const mockDays = Array.from({ length: 14 }, (_, i) => {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          return {
            date: date.toISOString().split('T')[0],
            newSends: Object.values(GradeColor).reduce(
              (acc, grade) => ({
                ...acc,
                blue: 0,
                green: 0,
                orange: Math.floor(Math.random() * 5),
                yellow: Math.floor(Math.random() * 2.5),
                purple: Math.floor(Math.random() * 1.2),
                black: 0,
                red: 0,
              }),
              {} as { [key in GradeColor]: number }
            ),
            repeatedSends: Object.values(GradeColor).reduce(
              (acc, grade) => ({
                ...acc,
                blue: 0,
                green: 0,
                orange: Math.floor(Math.random() * 4),
                yellow: Math.floor(Math.random() * 2),
                purple: Math.floor(Math.random() * 1.1),
                black: 0,
                red: 0,
              }),
              {} as { [key in GradeColor]: number }
            ),
          }
        })
        set({ days: mockDays })
      },

      getToday: () => {
        let today = get().days.find((day) => day.date === getToday())
        if (!today) {
          today = createToday()

          set((state) => ({
            days: [...state.days, today!],
          }))
        }

        return today
      },

      getTwoWeeks: () => {
        return get()
          .days.sort((a, b) => a.date.localeCompare(b.date))
          .slice(-14)
      },

      addNewSend: (grade: GradeColor) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.date === getToday()
              ? {
                  ...day,
                  newSends: {
                    ...day.newSends,
                    [grade]: day.newSends[grade] + 1,
                  },
                }
              : day
          ),
        })),

      addRepeatedSend: (grade: GradeColor) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.date === getToday()
              ? {
                  ...day,
                  repeatedSends: {
                    ...day.repeatedSends,
                    [grade]: day.repeatedSends[grade] + 1,
                  },
                }
              : day
          ),
        })),
    }),
    {
      name: 'stats-storage',
    }
  )
)
