import { IsValidBirthDateConstraint } from './date.validator';

describe('IsValidBirthDateConstraint', () => {
  let validator: IsValidBirthDateConstraint;

  beforeEach(() => {
    validator = new IsValidBirthDateConstraint();
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('should validate valid birth date', () => {
    const validDate = new Date('1990-01-15');
    expect(validator.validate(validDate)).toBe(true);
  });

  it('should invalidate future date', () => {
    const futureDate = new Date('2030-01-01');
    expect(validator.validate(futureDate)).toBe(false);
  });

  it('should invalidate very old date (more than 150 years)', () => {
    const oldDate = new Date('1800-01-01');
    expect(validator.validate(oldDate)).toBe(false);
  });

  it('should invalidate invalid date', () => {
    expect(validator.validate('invalid-date')).toBe(false);
  });

  it('should invalidate null date', () => {
    expect(validator.validate(null)).toBe(false);
  });

  it('should invalidate undefined date', () => {
    expect(validator.validate(undefined)).toBe(false);
  });

  it('should return correct error message', () => {
    expect(validator.defaultMessage()).toBe('Data de nascimento inválida');
  });
});
