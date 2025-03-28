"use client"
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, FilterIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'



export function FormCalculo({ inicio, fim }: { inicio: string, fim: string }) {

    const [inicioDate, setInicio] = useState<Date | undefined>(new Date(inicio + ' 06:00:01'))
    const [fimDate, setFim] = useState<Date | undefined>(new Date(fim + ' 06:00:01'))

    return (
        <form method='GET'>
            <div className="grid grid-cols-2 md:grid-cols-3 w-full max-w-[800px] gap-4">
                <input type="hidden" name="inicio" value={inicioDate && format(inicioDate, "y-MM-dd")} />
                <input type="hidden" name="fim" value={fimDate && format(fimDate, "y-MM-dd")} />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className='md:min-w-52 flex justify-between' variant={'outline'}>
                            {format(inicioDate || '', "dd/MM/y")} <CalendarIcon /></Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar disabled={date => date.getFullYear() != 2025} locale={ptBR} defaultMonth={inicioDate} selected={inicioDate} onSelect={setInicio} mode='single' />
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button className='md:min-w-52 flex justify-between' variant={'outline'}>
                            {format(fimDate || '', "dd/MM/y")}
                            <CalendarIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar disabled={date => date.getFullYear() != 2025}  defaultMonth={fimDate} selected={fimDate} onSelect={setFim} mode='single' />
                    </PopoverContent>
                </Popover>
                <Button type='submit' className='col-span-2 md:col-span-1'>
                    Filtrar <FilterIcon />
                </Button>
            </div>
        </form>
    )
}