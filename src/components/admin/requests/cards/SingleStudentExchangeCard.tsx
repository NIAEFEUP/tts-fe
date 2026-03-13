import { useState } from 'react'
import { ClassDescriptor, UrgentRequest } from '../../../../@types'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { Button } from '../../../ui/button'
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Person } from './Person'
import { ExchangeStatus } from './ExchangeStatus'
import { AdminPreviewSchedule } from '../AdminPreviewSchedule'
import { AdminRequestCardFooter } from './AdminRequestCardFooter'
import useStudentsSchedule from '../../../../hooks/admin/useStudentsSchedule'
import { RequestDate } from './RequestDate'
import { listEmailExchanges } from '../../../../utils/mail'
import { AdminRequestType } from '../../../../utils/exchange'

type Props = {
  exchange: UrgentRequest
}

export const SingleStudentExchangeCard = ({ exchange }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [exchangeState, setExchangeState] = useState(exchange)

  const { schedule } = useStudentsSchedule(exchange.issuer_nmec)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-9 py-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1 ">
              <div className="flex items-center gap-2">
                <CardTitle>
                  <h2 className="font-bold">{`#${exchange.id}`}</h2>
                </CardTitle>
                <ExchangeStatus exchange={exchangeState} />
              </div>
              {!open && <RequestDate date={exchange.date} />}
            </div>
            {!open && (
              <>
                <Person name={exchange.issuer_name} nmec={exchange.issuer_nmec} />
              </>
            )}
          </div>
          <div>
            <Button
              onClick={() => setOpen((prev) => !prev)}
              variant="outline"
              className="ml-6 h-9 w-9 border-2 border-slate-200 bg-white p-0 text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-400 hover:text-slate-700"
            >
              {open ? <ChevronUpIcon size={18} strokeWidth={2.5} /> : <ChevronDownIcon size={18} strokeWidth={2.5} />}
            </Button>
          </div>
        </CardHeader>

        <CardContent className={`w-full ${open ? 'px-9 pb-4 pt-0' : 'p-0'}`}>
          {open && (
            <div className="flex flex-col gap-y-6">
              <div className="flex items-center justify-between gap-6 py-2">
                <Person name={exchange.issuer_name} nmec={exchange.issuer_nmec} />
                <div className="max-w-md flex-1">
                  <div className="flex flex-col gap-y-2 rounded-md border-2 border-gray-200 p-2 px-4">
                    {[...exchange.options]
                      .sort((a, b) => a.course_info.acronym.localeCompare(b.course_info.acronym))
                      .map((option) => (
                        <div key={option.course_info.course} className="flex items-center justify-between gap-3">
                          <span className="font-bold">{option.course_info.acronym}</span>
                          <div className="text-muted-foreground flex items-center gap-2">
                            <span>{option.class_issuer_goes_from.name}</span>
                            <ArrowRightIcon size={14} />
                            <span className="text-foreground font-medium">{option.class_issuer_goes_to.name}</span>
                          </div>
                          <span className="text-xs italic">
                            ({option.class_issuer_goes_from.vacancies ?? 'N/A'}
                            <ArrowRightIcon className="mx-0.5 inline" size={10} />
                            {option.class_issuer_goes_to.vacancies ?? 'N/A'} {'vagas'})
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <AdminPreviewSchedule
                    originalSchedule={schedule}
                    classesToAdd={exchange.options.map((option): ClassDescriptor => {
                      return {
                        classInfo: option.class_issuer_goes_to,
                        courseInfo: option.course_info,
                        slotInfo: null,
                      }
                    })}
                  />
                </div>
              </div>
              <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                <h2 className="text-base font-bold  ">Motivo</h2>
                <p className="text-sm leading-relaxed">{exchange.message}</p>
              </div>
            </div>
          )}
        </CardContent>

        {open && (
          <AdminRequestCardFooter
            nmecs={[exchange.issuer_nmec]}
            exchangeMessage={listEmailExchanges(
              exchange.options.map((option) => ({
                participant_name: exchange.issuer_name,
                participant_nmec: exchange.issuer_nmec,
                goes_from: option.class_issuer_goes_from.name,
                goes_to: option.class_issuer_goes_to.name,
                course_acronym: option.course_info.acronym,
              }))
            )}
            requestType={AdminRequestType.URGENT_EXCHANGE}
            requestId={exchange.id}
            setExchange={setExchangeState}
            courseId={exchange.options.map((option) => option.course_info.course)}
          />
        )}
      </Card>
    </>
  )
}
