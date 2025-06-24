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
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const formSchema = z.object({
  airlineCode: z.string().length(2, { message: "2-letter code." }).regex(/^[A-Z0-9]{2}$/i, { message: "Invalid." }),
  flightDigits: z.string().min(1, { message: "Required." }).max(5, { message: "Max 5 digits." }).regex(/^\d+$/, { message: "Digits only." }),
  isDeadhead: z.boolean().default(false),
  departureLocation: z.string().length(3, { message: "Provide the 3-letter airport code." }),
  arrivalLocation: z.string().length(3, { message: "Provide the 3-letter airport code." }),
  date: z.date({ required_error: "A date is required." }),
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
    defaultValues: { airlineCode: "", flightDigits: "", isDeadhead: false, departureLocation: "", arrivalLocation: "", departureTime: "", arrivalTime: "" },
  });

  const { watch, setValue } = form;
  const isDeadhead = watch('isDeadhead');
  const dateValue = watch('date');

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [manualDateInput, setManualDateInput] = useState("");

  const flightDigitsRef = useRef<HTMLInputElement>(null);
  const departureLocationRef = useRef<HTMLInputElement>(null);
  const arrivalLocationRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const departureTimeRef = useRef<HTMLInputElement>(null);
  const arrivalTimeRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Syncs the manual date text input when the calendar value changes
  useEffect(() => {
    if (dateValue) {
      setManualDateInput(format(dateValue, "dd-MM-yyyy"));
    }
  }, [dateValue]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onDutyAdd(values);
    form.reset();
    setManualDateInput("");
  }

  const isTimeComplete = (value: string) =>
    value.replace(/\D/g, '').length === 4;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <div className="flex items-start gap-2">
          <FormField
            control={form.control}
            name="airlineCode"
            render={({ field }) => (
              <FormItem className="w-1/4">
                <FormLabel>Flight</FormLabel>
                <div className="relative">
                  {isDeadhead && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">DH/</span>}
                  <FormControl>
                    <Input
                      placeholder="EW"
                      className={cn("uppercase", isDeadhead && "pl-11")}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        field.onChange(value);
                        if (value.length === 2) {
                          flightDigitsRef.current?.focus();
                        }
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="flightDigits"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>&nbsp;</FormLabel>
                <FormControl>
                  <Input
                    placeholder="202"
                    {...field}
                    ref={flightDigitsRef}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                      field.onChange(value);
                      if (value.length === field.value.length && value.length >= 3) { // A common pattern is 3-4 digits
                        departureLocationRef.current?.focus();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isDeadhead"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Deadhead Duty</FormLabel>
                <FormDescription>Is this a non-flying duty assignment?</FormDescription>
              </div>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
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
                <FormControl>
                  <Input
                    placeholder="PMI"
                    maxLength={3}
                    {...field}
                    ref={departureLocationRef}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      field.onChange(value);
                      if (value.length === 3) arrivalLocationRef.current?.focus();
                    }}
                  />
                </FormControl>
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
                <FormControl>
                  <Input
                    placeholder="HAM"
                    maxLength={3}
                    {...field}
                    ref={arrivalLocationRef}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      field.onChange(value);
                      if (value.length === 3) dateRef.current?.focus();
                    }}
                  />
                </FormControl>
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
              <div className="flex items-center gap-2">
                <Input
                  placeholder="DD-MM-YYYY"
                  ref={dateRef}
                  value={manualDateInput}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, ''); // 1. Allow only digits
                    if (val.length > 8) val = val.slice(0, 8);

                    // 2. Apply DD-MM-YYYY mask
                    if (val.length > 4) {
                      val = `${val.slice(0, 2)}-${val.slice(2, 4)}-${val.slice(4)}`;
                    } else if (val.length > 2) {
                      val = `${val.slice(0, 2)}-${val.slice(2)}`;
                    }
                    setManualDateInput(val);

                    // 3. If the masked value is a full date, update the form and jump
                    if (val.length === 10) {
                      const parsedDate = parse(val, "dd-MM-yyyy", new Date());
                      if (!isNaN(parsedDate.getTime())) {
                        setValue("date", parsedDate, { shouldValidate: true });
                      }
                      departureTimeRef.current?.focus();
                    }
                  }}
                />
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild><Button variant={"outline"} size="icon"><CalendarIcon className="h-4 w-4" /></Button></PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) setValue("date", date, { shouldValidate: true });
                        setIsCalendarOpen(false);
                        departureTimeRef.current?.focus();
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
                <FormControl>
                  <Input
                    type="text"
                    placeholder="HH:MM"
                    maxLength={5}
                    ref={departureTimeRef}
                    value={field.value}
                    onChange={(e) => {
                      // Only allow digits and colon
                      let val = e.target.value.replace(/[^\d]/g, '');
                      if (val.length > 4) val = val.slice(0, 4);

                      // Auto-insert colon after 2 digits
                      if (val.length > 2) val = `${val.slice(0, 2)}:${val.slice(2)}`;
                      field.onChange(val);

                      // Jump focus after 4 digits (i.e. HHMM)
                      if (val.replace(/\D/g, '').length === 4) {
                        arrivalTimeRef.current?.focus();
                      }
                    }}
                  />
                </FormControl>
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
                <FormControl>
                  <Input
                    type="text"
                    placeholder="HH:MM"
                    maxLength={5}
                    ref={(el) => {
                      field.ref(el);
                      (arrivalTimeRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
                    }}
                    value={field.value}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^\d]/g, '');
                      if (val.length > 4) val = val.slice(0, 4);
                      if (val.length > 2) val = `${val.slice(0, 2)}:${val.slice(2)}`;
                      field.onChange(val);

                      if (val.replace(/\D/g, '').length === 4) {
                        submitButtonRef.current?.focus();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" ref={submitButtonRef}>Add Duty</Button>
        </div>
      </form>
    </Form>
  )
}