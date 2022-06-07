export class ValidatorOfAge {
  public static validator(birth_date: string): boolean {
    const today = new Date();
    const thisYear = today.getFullYear();
    const birth_dateSplit = birth_date.split('/');
    const bDay = Number(birth_dateSplit[0]);
    const bMonth = Number(birth_dateSplit[1]);
    const bYear = Number(birth_dateSplit[2]);
    let age = thisYear - bYear;
    const thisMonth = today.getMonth() + 1;

    //Se mês atual for menor que o nascimento, não fez aniversário ainda;
    if (thisMonth < bMonth) {
      age--;
    } else {
      //Se estiver no mês do nascimento, verificar o dia
      if (thisMonth == bMonth) {
        if (new Date().getDate() < bDay) {
          //Se a data atual for menor que o dia de nascimento ele ainda não fez aniversário
          age--;
        }
      }
    }
    if (age >= 18) {
      return true;
    } else {
      return false;
    }
  }
}
