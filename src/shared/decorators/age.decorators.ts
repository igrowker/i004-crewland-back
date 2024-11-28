import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const date = new Date(value);
          return date <= new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser una fecha válida en el pasado.`;
        },
      },
    });
  };
}
