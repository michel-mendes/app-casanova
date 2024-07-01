interface IContasPagarSemana {
    inicioSemana: moment.Moment,
    fimSemana: moment.Moment,
    totalSemana: number
}

export type ContasPagarTotalSemanas = Array<IContasPagarSemana>