import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

interface RadioGroupFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  orientation?: "horizontal" | "vertical";
}

export function RadioGroupField<T extends FieldValues>({
  name,
  label,
  required,
  options,
  orientation = "vertical",
}: RadioGroupFieldProps<T>) {
  const { control } = useFormContext<T>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={field.onChange}
              className={
                orientation === "horizontal" ? "flex flex-wrap gap-4" : "flex flex-col gap-2"
              }
            >
              {options.map((o) => (
                <div key={o.value} className="flex items-center gap-2">
                  <RadioGroupItem value={o.value} id={`${name}-${o.value}`} />
                  <Label htmlFor={`${name}-${o.value}`} className="font-normal cursor-pointer">
                    {o.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
