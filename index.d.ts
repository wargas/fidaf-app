export interface Resumo {
    mes: string
    imposto: string
    nominal: string
    corrigido: string
}

export type Recolhimento = Array<{
    data: string
    imposto: string
    nominal: number
    corrigido: number
  }>

  export type Calculo = {
    prev: {
      nominal: number
      corrigida: number
    }
    curr: {
      nominal: number
      corrigida: number
    }
    incremento: {
      valor: number
      porcentagem: number
    }
    premio: {
      porcentagem: number
      valor: number
    }
    distribuicao: {
      pontos: number
      auditor: number
      analista: number
    }
  }
  

  export type IPCA = {
    id: number,
    mes: string,
    indice: string
  }