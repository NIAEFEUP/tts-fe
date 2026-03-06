import * as Sentry from '@sentry/react'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { useForm } from 'react-hook-form'
import { Input } from './ui/newInput'
import { Textarea } from './ui/textarea'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from './ui/use-toast'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { FlagIcon } from '@heroicons/react/24/outline'
import { Dropdown, DropdownItems, DropdownTrigger } from './ui/dropdown'

enum ReportType {
  Suggestion = 'Sugestão',
  Bug = 'Bug',
}

const bugSchema = z.object({
  email: z.string().optional(),
  description: z.string().trim().min(1, { message: 'É necessário descreveres' }),
})

export const FeedbackReport = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [reportType, setReportType] = useState<ReportType>(ReportType.Suggestion)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof bugSchema>>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      email: undefined,
      description: undefined,
    },
  })

  const onSubmit = (values: z.infer<typeof bugSchema>) => {
    const eventId = Sentry.captureMessage(reportType)

    const userFeedback = {
      type: reportType,
      email: values.email ?? '',
      message: values.description,
      associatedEventId: eventId,
    }
    Sentry.captureFeedback(userFeedback)

    setOpen(false)
    form.reset()

    toast({
      title: 'Enviado! Obrigado pelo teu feedback',
      duration: 3000,
    })
  }

  return (
    <Dropdown open={open} onOpenChange={setOpen}>
      <DropdownTrigger asChild>
        <Button variant="icon" className="rounded-full flex flex-row gap-x-2">
          <FlagIcon className="h-5 w-5 text-black dark:text-white md:dark:text-black" />
          <p className="hidden sm:block text-black dark:text-white md:dark:text-black">Feedback</p>
        </Button>
      </DropdownTrigger>

      <DropdownItems className="ml-5 p-4 w-[320px] flex flex-col gap-y-4">
        <Tabs defaultValue="suggestion">
          <TabsList className="w-full">
            <TabsTrigger value="suggestion" onClick={() => setReportType(ReportType.Suggestion)} className="w-full">
              Sugestão
            </TabsTrigger>
            <TabsTrigger value="bug" onClick={() => setReportType(ReportType.Bug)} className="w-full">
              Bug
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col" onKeyDown={(e) => e.stopPropagation()}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-col pb-1 gap-1">
                  <FormLabel>Email (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <div className="absolute bottom-0 left-0">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-col gap-1 pb-6">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição" className="resize-none" rows={3} {...field} />
                  </FormControl>
                  <div className="absolute bottom-0 left-0">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-2">
              Submeter
            </Button>
          </form>
        </Form>
      </DropdownItems>
    </Dropdown>
  )
}
