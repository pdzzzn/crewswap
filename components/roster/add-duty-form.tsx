'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Defines the shape and validation rules for our form, including the new fields
const formSchema = z.object({
  airlineCode: z.string().length(2, { message: "2-letter code." }).regex(/^[A-Z0-9]{2}$/i, { message: "Invalid." }),
  flightDigits: z.string().min(1, { message: "Required." }).max(5, { message: "Max 5 digits." }).regex(/^\d+$/, { message: "Digits only." }),
  isDeadhead: z.boolean().default(false),
  departureLocation: z.string().length(3, { message: "Provide the 3-letter airport code." }),
  arrivalLocation: z.string().length(3, { message: "Provide the 3-letter airport code." }),
  date: z.date({ required_error: "A date is required for the duty." }),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Use HH:mm format." }),
  arrivalTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Use HH:mm format." }),
});

interface AddDutyFormProps {
  onDutyAdd: (duty: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export function AddDutyForm({ onDutyAdd, onCancel }: AddDutyFormProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airlineCode: "",
      flightDigits: "",
      isDeadhead: false,
      departureLocation: "",
      arrivalLocation: "",
      departureTime: "",
      arrivalTime: "",
    },
  });

  const isDeadhead = form.watch('isDeadhead');

  function onSubmit(values: z.infer<typeof formSchema>) {
    onDutyAdd(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* New Flight Number fields with conditional prefix */}
        <FormItem>
          <FormLabel>Flight</FormLabel>
          <div className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="airlineCode"
              render={({ field }) => (
                <FormItem className="w-1/4">
                  <div className="relative">
                    {/* This span is the non-editable prefix */}
                    {isDeadhead && (
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        DH/
                      </span>
                    )}
                    <FormControl>
                      <Input
                        placeholder="EW"
                        // Add padding only when the switch is on
                        className={cn(
                          "uppercase",
                          isDeadhead && "pl-11"
                        )}
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flightDigits"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl><Input placeholder="7591" {...field} /></FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormMessage>
            {form.formState.errors.airlineCode?.message || form.formState.errors.flightDigits?.message}
          </FormMessage>
        </FormItem>

        <FormField
          control={form.control}
          name="isDeadhead"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Deadhead Duty</FormLabel>
                <FormDescription>
                  Is this a non-flying duty assignment?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departureLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure</FormLabel>
                <FormControl><Input placeholder="e.g., PMI" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrivalLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival</FormLabel>
                <FormControl><Input placeholder="e.g., HAM" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departureTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Time</FormLabel>
                <FormControl><Input type="time" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrivalTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival Time</FormLabel>
                <FormControl><Input type="time" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Duty</Button>
        </div>
      </form>
    </Form>
  )
}