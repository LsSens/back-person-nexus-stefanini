import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidBirthDateConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (!value) return false;
    
    if (typeof value === 'string') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) return false;
      
      const date = new Date(value);
      const now = new Date();
      
      if (isNaN(date.getTime())) return false;
      
      if (date > now) return false;
      
      const maxAge = new Date();
      maxAge.setFullYear(maxAge.getFullYear() - 150);
      if (date < maxAge) return false;
      
      return true;
    }
    
    const date = new Date(value);
    const now = new Date();
    
    if (isNaN(date.getTime())) return false;
    
    if (date > now) return false;
    
    const maxAge = new Date();
    maxAge.setFullYear(maxAge.getFullYear() - 150);
    if (date < maxAge) return false;
    
    return true;
  }

  defaultMessage() {
    return 'Data de nascimento inválida';
  }
}

export function IsValidBirthDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidBirthDateConstraint,
    });
  };
}
