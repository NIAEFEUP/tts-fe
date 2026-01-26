import * as Sentry from "@sentry/react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { Button } from "./ui/button"
import { DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { FlagIcon } from "@heroicons/react/24/outline";

enum ReportType {
  Suggestion = "Sugestão",
  Bug = "Bug"
}

const bugSchema = z.object({
  email: z.string().optional(),
  description: z.string().trim().min(1, { message: "É necessário descreveres" }),
})

export const FeedbackReport = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [reportType, setReportType] = useState<ReportType>(ReportType.Suggestion);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof bugSchema>>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      email: undefined,
      description: undefined,
    },
  });

  const { register } = form;

  const onSubmit = (values: z.infer<typeof bugSchema>) => {
    const eventId = Sentry.captureMessage(reportType);

    const userFeedback = {
      type: reportType,
      email: values.email ?? "",
      message: values.description,
      associatedEventId: eventId,
    };
    Sentry.captureFeedback(userFeedback);

    setOpen(false);

    toast({
      title: "Enviado! Obrigado pelo teu feedback",
      duration: 3000,
    })
  }

  return <DropdownMenu open={open} onOpenChange={setOpen}>
    <DropdownMenuTrigger asChild>
      <Button variant="icon" className="rounded-full flex flex-row gap-x-2">
        <FlagIcon className="h-5 w-5 text-black dark:text-white md:dark:text-black" />
        <p className="hidden sm:block text-black dark:text-white md:dark:text-black">Feedback</p>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="ml-5">
      <Tabs defaultValue="suggestion">
        <TabsList className="w-full">
          <TabsTrigger value="suggestion" onClick={() => setReportType(ReportType.Suggestion)}>Sugestão</TabsTrigger>
          <TabsTrigger value="bug" onClick={() => setReportType(ReportType.Bug)}>Bug</TabsTrigger>
        </TabsList>
      </Tabs>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 p-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} {...register("email")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descrição" {...field} {...register("description")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submeter</Button>
        </form>
      </Form>
    </DropdownMenuContent >
  </DropdownMenu >
}
