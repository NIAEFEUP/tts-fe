import * as Sentry from "@sentry/react";
import { BugAntIcon } from "@heroicons/react/24/solid"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "./ui/use-toast";

const bugSchema = z.object({
  email: z.string().optional(),
  description: z.string({ message: "É necessário descreveres o bug" }),
})

export const BugReport = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof bugSchema>>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      email: undefined,
      description: undefined
    },
  });

  const { register } = form;

  const onSubmit = (values: z.infer<typeof bugSchema>) => {
    const eventId = Sentry.captureMessage("User Feedback");

    const userFeedback = {
      email: values.email ?? "",
      message: values.description,
      associatedEventId: eventId,
    };
    Sentry.captureFeedback(userFeedback);

    setOpen(false);
    toast({
      title: "Obrigado!",
      description: "O bug submetido com sucesso.",
      duration: 3000,
    })
  }

  return <DropdownMenu open={open} onOpenChange={setOpen}>
    <DropdownMenuTrigger asChild>
      <Button variant="icon">
        <BugAntIcon className="h-5 w-5 text-black" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 p-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} {...register("email")} />
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
                  <Textarea placeholder="Descrição do bug." {...field} {...register("description")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submeter</Button>
        </form>
      </Form>
    </DropdownMenuContent>
  </DropdownMenu >
}
