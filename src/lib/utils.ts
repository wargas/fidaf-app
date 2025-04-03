import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMeses() {
  return [
    { codigo: 1, abrev: 'Jan', nome: 'Janeiro' },
    { codigo: 2, abrev: 'Fev', nome: 'Fevereiro' },
    { codigo: 3, abrev: 'Mar', nome: 'Março' },
    { codigo: 4, abrev: 'Abr', nome: 'Abril' },
    { codigo: 5, abrev: 'Mai', nome: 'Maio' },
    { codigo: 6, abrev: 'Jun', nome: 'Junho' },
    { codigo: 7, abrev: 'Jul', nome: 'Julho' },
    { codigo: 8, abrev: 'Ago', nome: 'Agosto' },
    { codigo: 9, abrev: 'Set', nome: 'Setembro' },
    { codigo: 10, abrev: 'Out', nome: 'Outubro' },
    { codigo: 11, abrev: 'Nov', nome: 'Novembro' },
    { codigo: 12, abrev: 'Dez', nome: 'Dezembro' }
  ];
}