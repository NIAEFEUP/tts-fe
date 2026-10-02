import * as Sentry from '@sentry/react'
import { Button } from './ui/new/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { useForm } from 'react-hook-form'
import { Input } from './ui/new/input'
import { Textarea } from './ui/new/textArea'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from './ui/new/toaster'
import { useState } from 'react'
import { Tabs } from './ui/new/tabs'
import { Flag } from 'lucide-react'
import { Menu } from './ui/new/menu'

enum ReportType {
  Suggestion = 'Sugestão',
  Bug = 'Bug',
}

// Must match the `tunnel` option in src/index.tsx and the nginx `location = /feedback` block.
const SENTRY_TUNNEL = '/feedback'
const SENTRY_PROBE_TIMEOUT_MS = 4000

/**
 * Probes the Sentry tunnel to detect whether submissions would be blocked
 * (e.g. by an adblocker or a failing tunnel). The tunnel is same-origin, so a
 * rejected request means the transport is unreachable.
 */
const isSubmissionBlocked = async (): Promise<boolean> => {
  if (!import.meta.env.VITE_APP_SENTRY_DSN) return false

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), SENTRY_PROBE_TIMEOUT_MS)

  try {
    await fetch(SENTRY_TUNNEL, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    })
    return false
  } catch {
    return true
  } finally {
    clearTimeout(timeout)
  }
}

const bugSchema = z.object({
  email: z.string().optional(),
  description: z.string().trim().min(1, { message: 'É necessário descreveres' }),
})

export const FeedbackReport = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [reportType, setReportType] = useState<ReportType>(ReportType.Suggestion)

  const form = useForm<z.infer<typeof bugSchema>>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      email: undefined,
      description: undefined,
    },
  })

  const onSubmit = async (values: z.infer<typeof bugSchema>) => {
    if (await isSubmissionBlocked()) {
      toast({
        variant: 'negative',
        title: 'Não foi possível enviar o feedback',
        description:
          'Parece que tens um bloqueador de anúncios ativo. Desativa-o para este site e tenta novamente, ou envia-nos um email para ni@aefeup.pt.',
        duration: 8000,
      })
      return
    }

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
          <Tabs.Items className="w-full pb-0">
            <Tabs.Item className="flex-1">Sugestão</Tabs.Item>
            <Tabs.Item className="flex-1">Bug</Tabs.Item>
          </Tabs.Items>
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
