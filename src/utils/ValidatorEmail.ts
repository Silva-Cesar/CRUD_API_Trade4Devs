export class ValidatorEmail {

    public static validator(email: string): boolean {
            if ((!email.match(/^([a-z0-9_\.-]+\@[\da-z\.-]+\.[a-z\.]{2,6})$/gm))) { 
                return false;
            }
            return true;
        }
    }