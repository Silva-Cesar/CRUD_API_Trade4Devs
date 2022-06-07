export class ValidatorDate {
  public static validator(date: string): boolean {
    const dateRegex = /^([123]0|[012][1-9]|31)\/(0[1-9]|1[012])\/(19[0-9]{2}|2[0-9]{3})$/;
    return dateRegex.test(date);
  }
}
