import { CpfConstraint } from './cpf.validator';

describe('CpfConstraint', () => {
  let validator: CpfConstraint;

  beforeEach(() => {
    validator = new CpfConstraint();
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('should validate valid CPF', () => {
    const validCpf = '11144477735';
    expect(validator.validate(validCpf)).toBe(true);
  });

  it('should invalidate invalid CPF', () => {
    const invalidCpf = '12345678901';
    expect(validator.validate(invalidCpf)).toBe(false);
  });

  it('should invalidate empty CPF', () => {
    expect(validator.validate('')).toBe(false);
  });

  it('should invalidate null CPF', () => {
    expect(validator.validate(null)).toBe(false);
  });

  it('should return correct error message', () => {
    expect(validator.defaultMessage()).toBe('CPF inválido');
  });
});
