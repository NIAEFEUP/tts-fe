import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";

interface PageSizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const PageSizeSelector = ({
  value,
  onChange,
}: PageSizeSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger className="h-8 w-[72px] text-xs">
          <SelectValue placeholder="Number of Cards"/>
        </SelectTrigger>

        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
