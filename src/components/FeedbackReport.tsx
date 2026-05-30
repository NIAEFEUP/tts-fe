import * as Sentry from '@sentry/react'
import { Button } from './ui/new/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { useForm } from 'react-hook-form'
import { Input } from './ui/new/input'
import { Textarea } from './ui/new/textArea'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from './ui/use-toast'
import { useState } from 'react'
import { Tabs, TabsItem, TabsItems } from './ui/new/tabs'
import { Flag } from 'lucide-react'
import { Menu } from './ui/new/menu'

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
    <Menu open={open} onOpenChange={setOpen}>
      <Menu.Trigger asChild>
        <Button variant="outline">
          <Flag size="16" />
          <p className="hidden sm:block ">Feedback</p>
        </Button>
      </Menu.Trigger>

      <Menu.Items className="p-4 w-[320px] flex flex-col gap-y-4">
        <Tabs
          selectedIndex={reportType === ReportType.Suggestion ? 0 : 1}
          onChange={(index) => setReportType(index === 0 ? ReportType.Suggestion : ReportType.Bug)}
        >
          <TabsItems className="w-full pb-0">
            <TabsItem className="flex-1">Sugestão</TabsItem>
            <TabsItem className="flex-1">Bug</TabsItem>
          </TabsItems>
        </Tabs>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col" onKeyDown={(e) => e.stopPropagation()}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative flex w-full flex-col pb-1 gap-1">
                  <FormLabel className="w-fit">Email (opcional)</FormLabel>
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
                  <FormLabel className="w-fit">Descrição</FormLabel>
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
      </Menu.Items>
    </Menu>
  )
}
