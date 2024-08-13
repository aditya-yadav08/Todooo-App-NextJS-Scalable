"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { CalendarIcon, Text } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { CardFooter } from "../ui/card";
import { Calendar } from "../ui/calendar";

const FormSchema = z.object({
  taskName: z.string().min(2, {
    message: "Task Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  dueDate: z.date({ required_error: "A due date is required" }),
  priority: z.string().min(1, {
    message: "Please select a Priority",
  }),
  projectId: z.string().min(1, {
    message: "Please select a Project",
  }),
  labelId: z.string().min(1, {
    message: "Please select a Label",
  }),
});

export default function AddTaskInline({
  setShowAddTask,
}: {
  setShowAddTask: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      taskName: "",
      description: "",
      priority: "1",
      dueDate: new Date(),
      projectId: "k97cpa1q8rbfjeecwzs26yzzq16yqmkk",
      labelId: "k5757cjp6d2nfr7exfmwmebb5s6yq1sv",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
        >
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="taskName"
                    type="text"
                    placeholder="Enter your Task name"
                    required
                    className="border-0 font-semibold text-lg"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-start gap-2">
                    <Text className=" ml-auto h-4 w-4 opacity-50" />
                    <Textarea
                      id="description"
                      placeholder="Description"
                      required
                      className="resize-none"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <CardFooter className="flex flex-col lg:flex-row lg:justify-between gap-2 border-t-2 pt-3">
            <div className="w-full lg:w-1/4"></div>
            <div className="flex gap-3 self-end">
              <Button
                className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
                variant={"outline"}
                onClick={() => setShowAddTask(false)}
              >
                Cancel
              </Button>
              <Button className="px-6" type="submit">
                Add Task
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
