// from https://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js


export class ValidatorCPF {

    public static validator(cpf: string): boolean {

        try {

            let sum = 0;
            let remainders;            

            if (
                (!cpf.match(/^[0-9]+$/)) ||                
                (cpf == "00000000000") ||
                (cpf == "11111111111") ||
                (cpf == "22222222222") ||
                (cpf == "33333333333") ||
                (cpf == "44444444444") ||
                (cpf == "55555555555") ||
                (cpf == "66666666666") ||
                (cpf == "77777777777") ||
                (cpf == "88888888888") ||
                (cpf == "99999999999") ||
                (cpf.length != 11) //||     

            ) {
                return false;
            }

            for (let index = 1; index <= 9; index++) {
                sum = sum + parseInt(cpf.substring(index - 1, index)) * (11 - index);
            }

            remainders = (sum * 10) % 11;

            if ((remainders == 10) || (remainders == 11)) {
                remainders = 0;
            }

            if (remainders != parseInt(cpf.substring(9, 10))) {
                return false;
            }

            sum = 0;

            for (let index = 1; index <= 10; index++) {
                sum = sum + parseInt(cpf.substring(index - 1, index)) * (12 - index);
            }

            remainders = (sum * 10) % 11;

            if ((remainders == 10) || (remainders == 11)) {
                remainders = 0;
            }

            if (remainders != parseInt(cpf.substring(10, 11))) {
                return false;
            }

            return true;

        } catch (error) {



            return false;
        }

    }

}