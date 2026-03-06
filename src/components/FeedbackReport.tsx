import * as Sentry from '@sentry/react'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full min-h-[80px]">
                  <FormLabel>Email (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="min-h-[100px]">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 w-full">
              Submeter
            </Button>
          </form>
        </Form>
      </DropdownItems>
    </Dropdown>
  )
}
