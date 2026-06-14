import { useState } from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { SelectOption } from "./SelectField";
import { cn } from "@/lib/utils";

interface MultiSelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options: SelectOption[];
  emptyText?: string;
}

export function MultiSelectField<T extends FieldValues>({
  name,
  label,
  placeholder = "Select…",
  required,
  disabled,
  options,
  emptyText = "No options",
}: MultiSelectFieldProps<T>) {
  const { control } = useFormContext<T>();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected: string[] = Array.isArray(field.value) ? field.value : [];
        const toggle = (value: string) => {
          field.onChange(
            selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
          );
        };
        const remove = (value: string) => field.onChange(selected.filter((v) => v !== value));

        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  disabled={disabled || options.length === 0}
                  className={cn(
                    "w-full justify-between font-normal min-h-9 h-auto py-1.5",
                    selected.length === 0 && "text-muted-foreground",
                  )}
                >
                  <div className="flex flex-wrap gap-1">
                    {selected.length === 0 && <span>{placeholder}</span>}
                    {selected.map((v) => {
                      const opt = options.find((o) => o.value === v);
                      return (
                        <Badge
                          key={v}
                          variant="secondary"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(v);
                          }}
                        >
                          {opt?.label ?? v}
                          <X className="size-3" />
                        </Badge>
                      );
                    })}
                  </div>
                  <ChevronsUpDown className="opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search…" />
                  <CommandList>
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup>
                      {options.map((o) => {
                        const isSelected = selected.includes(o.value);
                        return (
                          <CommandItem key={o.value} onSelect={() => toggle(o.value)}>
                            <Check
                              className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")}
                            />
                            {o.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
