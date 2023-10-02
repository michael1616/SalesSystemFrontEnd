export interface ResponseApi {
    statusCode: number,
    isExitoso: boolean,
    errorMessages: string[],
    resultado: any,
    totalPaginas: number
}
