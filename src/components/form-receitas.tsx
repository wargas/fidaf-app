"use client"
import { addHours, addYears, format, subYears } from 'date-fns'
import { CalendarIcon, FilterIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'

export function FormReceitas({ inicio: _inicio, fim: _fim }: { inicio: string, fim: string }) {

    const search = useSearchParams()

    const inicio = search.get('inicio') || _inicio
    const fim = search.get('fim') || _fim

    const [inicioDate, setInicio] = useState<Date | undefined>(new Date())
    const [fimDate, setFim] = useState<Date | undefined>(new Date())

    useEffect(() => {
        if (inicio != '' && fim != '') {
            setInicio(addHours(new Date(inicio || ''), 4))
            setFim(addHours(new Date(fim || ''), 4))
        }
    }, [inicio, fim])


    return (
        <form method='GET'>
            <div className="flex gap-4">
                <input type="hidden" name="inicio" value={inicioDate && format(inicioDate, "y-MM-dd")} />
                <input type="hidden" name="fim" value={fimDate && format(fimDate, "y-MM-dd")} />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className='md:min-w-52 flex justify-between' variant={'outline'}>
                            {format(inicioDate || '', "dd/MM/y")} <CalendarIcon /></Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar defaultMonth={inicioDate} selected={inicioDate} onSelect={setInicio} mode='single' />
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
                        <Calendar defaultMonth={fimDate} selected={fimDate} onSelect={setFim} mode='single' />
                    </PopoverContent>
                </Popover>
                <Button size={'icon'} type='submit'>
                    <FilterIcon />
                </Button>

                {inicioDate?.getFullYear() == 2025 && fimDate?.getFullYear() == 2025 && (
                    <Button variant={'link'} asChild className='ml-auto'>
                        <Link target='_parent' href={`/receitas?inicio=${format(subYears(inicioDate || '', 1), 'yyyy-MM-dd')}&fim=${format(subYears(fimDate || '', 1), 'yyyy-MM-dd')}`}>Comparar</Link>
                    </Button>
                )}

                {inicioDate?.getFullYear() == 2024 && fimDate?.getFullYear() == 2024 && (
                    <Button variant={'link'} asChild className='ml-auto'>
                        <Link target='_parent' href={`/receitas?inicio=${format(addYears(inicioDate || '', 1), 'yyyy-MM-dd')}&fim=${format(addYears(fimDate || '', 1), 'yyyy-MM-dd')}`}>Comparar</Link>
                    </Button>
                )}
            </div>
        </form>
    )
}