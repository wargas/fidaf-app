"use client"
import { ChangeEvent, HTMLInputTypeAttribute, InputHTMLAttributes, useCallback, useRef, useState } from "react";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format, parse } from "date-fns";
import { Button } from "./ui/button";
import { Calendar1Icon } from "lucide-react";

type Props = {} & InputHTMLAttributes<HTMLInputElement>

export function InputDate({ value, onChange, className, ...rest }: Props) {

    const [_value, setValue] = useState(value ? format(String(value+' 03:00:01'), 'dd/MM/yyyy') : '')
    const [dateValue, setDateValue] = useState<Date | undefined>(value ? new Date(String(value+' 03:00:01')) : undefined)

    const inputRef = useRef<HTMLInputElement>(null)


    const handleChangeText = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
        const dateParsed = parse(ev.target.value, 'dd/MM/yyyy', new Date())

        if (dateParsed) {
            setDateValue(dateParsed)
        } else {
            setDateValue(undefined)
        }
        setValue(ev.target.value)
    }, [])

    const handleSelect = useCallback((day: Date | undefined) => {
        if (day) {
            setDateValue(day)
            setValue(format(day, 'dd/MM/yyyy'))
        } else {
            setValue('')
        }
    }, [])

    const dispatchChange = (value: string) => {
        const event = new Event('input', {bubbles: true})

        inputRef.current?.dispatchEvent(event)
    }


    return (
        <>
            <input ref={inputRef} type="hidden" value={format(parse(String(_value), 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')} {...rest} />
            <Popover>
                <div className="flex items-center gap-1">
                    <Input onChange={handleChangeText} value={_value} />

                    <PopoverTrigger asChild>
                        <Button><Calendar1Icon /></Button>
                    </PopoverTrigger>
                </div>
                <PopoverContent>
                    <Calendar defaultMonth={dateValue} required onSelect={handleSelect} selected={dateValue} mode='single' />
                </PopoverContent>
            </Popover>
        </>
    )
}