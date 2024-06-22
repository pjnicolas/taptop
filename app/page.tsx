'use client'

import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Modal,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Menu,
  MenuItem,
  MenuDropdown,
  MenuTarget,
} from '@mantine/core'
import { BarChart } from '@mantine/charts'
import GradeSelector from '@/components/GradeSelector'
import { useStatsStore } from '@/store/stats'
import { GradeColor } from '@/utils/types'

enum SendType {
  REPEATED = 'repeated',
  NEW = 'new',
}

export default function Home() {
  const stats = useStatsStore()
  const [gradeModalOpen, setGradeModalOpen] = useState<null | SendType>(null)

  const today = stats.getToday()

  const statsToday = Object.values(GradeColor)
    .map((grade) => {
      return {
        grade,
        newSends: today.newSends[grade],
        repeatedSends: today.repeatedSends[grade],
      }
    })
    .filter(({ newSends, repeatedSends }) => newSends > 0 || repeatedSends > 0)

  return (
    <main className="p-4 overflow-y-auto h-screen">
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4" shadow="md" withBorder>
          <Button
            size="lg"
            onClick={() => setGradeModalOpen(SendType.REPEATED)}
          >
            Repeat send
          </Button>
          <Button size="lg" onClick={() => setGradeModalOpen(SendType.NEW)}>
            New send
          </Button>
        </Card>

        <Card shadow="md" withBorder>
          <div className="text-lg font-bold mb-4">Today</div>

          {statsToday.length === 0 ? (
            <div className="text-center text-neutral-400 py-4">
              No sends today
            </div>
          ) : (
            <Table striped withRowBorders={false}>
              <TableThead>
                <TableTr>
                  <TableTh>Color</TableTh>
                  <TableTh>New</TableTh>
                  <TableTh>Repeated</TableTh>
                </TableTr>
              </TableThead>
              <TableTbody>
                {statsToday.map(({ grade, newSends, repeatedSends }) => (
                  <TableTr key={grade}>
                    <TableTd>
                      <Badge color={grade} size="lg">
                        {grade}
                      </Badge>
                    </TableTd>
                    <TableTd>{newSends}</TableTd>
                    <TableTd>{repeatedSends}</TableTd>
                  </TableTr>
                ))}
              </TableTbody>
            </Table>
          )}
        </Card>

        <Card shadow="md" withBorder>
          <div className="text-lg font-bold mb-4">
            New sends on last 14 days
          </div>

          <BarChart
            h={300}
            data={stats.getTwoWeeks().map((day) => ({
              date: day.date,
              ...day.newSends,
            }))}
            dataKey="date"
            type="stacked"
            series={[
              { name: 'black', color: 'black' },
              { name: 'red', color: 'red' },
              { name: 'purple', color: 'purple' },
              { name: 'yellow', color: 'yellow' },
              { name: 'orange', color: 'orange' },
              { name: 'green', color: 'green' },
              { name: 'blue', color: 'blue' },
            ]}
          />
        </Card>

        <Menu shadow="md">
          <MenuTarget>
            <Button variant="transparent" size="sm">
              Options
            </Button>
          </MenuTarget>

          <MenuDropdown>
            <MenuItem
              color="red"
              onClick={() => {
                if (confirm('Are you sure you want to wipe all data?')) {
                  stats.wipeAll()
                }
              }}
            >
              Wipe all data
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (
                  confirm(
                    'Are you sure you want to WIPE all data and MOCK stats?'
                  )
                ) {
                  stats.addMockStats()
                }
              }}
            >
              Add mock data
            </MenuItem>
          </MenuDropdown>
        </Menu>

        <Modal
          opened={gradeModalOpen !== null}
          onClose={() => setGradeModalOpen(null)}
          title="Select the grade color"
          classNames={{
            title: 'text-lg font-bold',
          }}
        >
          <GradeSelector
            onClick={(color) => {
              setGradeModalOpen(null)

              if (gradeModalOpen === SendType.REPEATED) {
                stats.addRepeatedSend(color)
              } else if (gradeModalOpen === SendType.NEW) {
                stats.addNewSend(color)
              }
            }}
          />
        </Modal>
      </div>
    </main>
  )
}
