export class ValidatorEmail {
  public static validator(email: string): boolean {
      const emailRegex = /^([a-z0-9_\.-]+\@[\da-z\.-]+\.[a-z\.]{2,6})$/
    return emailRegex.test(email);
  }
}
