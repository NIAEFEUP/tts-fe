import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'

export function DirectExchangeSelection(props) {
  return (
    <div className="flex w-full justify-between">
      <div className="mt-4 flex flex-col space-y-4">
        <p>{props.UC}</p>
        <div className="flex flex-row items-center">
          <span className="w-fit bg-slate-200 p-2 text-center">{props.Class}</span>
          <span>
            <ArrowRightIcon className="mx-2 h-5 w-5"></ArrowRightIcon>
          </span>
          <Select>
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent className="flex flex-row">
              <SelectGroup>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
                <SelectItem value="3LEIC01">3LEIC01</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex flex-col space-y-4">
        <p>Estudante</p>
        <Input></Input>
      </div>
    </div>
  )
}
