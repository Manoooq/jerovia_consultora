import { describe, it, expect } from 'vitest';
import { paso1Schema, paso2Schema, formularioCompletoSchema } from './validations';

describe('Zod Validation Schemas', () => {
  describe('paso1Schema', () => {
    it('should validate a correct payload', () => {
      const validData = {
        nombre: 'Juan',
        apellido: 'Perez',
        fechaNacimiento: '1990-01-01',
        nacionalidad: 'Paraguaya',
        cedula: '1234567',
        estadoCivil: 'soltero',
        telefono: '0981123456',
        email: 'juan.perez@example.com',
        licenciaConducir: true,
        movilidadPropia: false,
        vinculosFamiliares: false,
      };

      const result = paso1Schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject when required fields are missing', () => {
      const invalidData = {
        nombre: 'Juan',
        // apellido missing
        fechaNacimiento: '1990-01-01',
        cedula: '1234567',
        estadoCivil: 'soltero',
        telefono: '0981123456',
      };

      const result = paso1Schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('apellido'))).toBe(true);
      }
    });

    it('should reject invalid email format but accept empty or optional', () => {
      // Invalid email
      let result = paso1Schema.safeParse({
        nombre: 'Juan',
        apellido: 'Perez',
        fechaNacimiento: '1990-01-01',
        cedula: '1234567',
        estadoCivil: 'soltero',
        telefono: '0981123456',
        email: 'not-an-email',
      });
      expect(result.success).toBe(false);

      // Empty string
      result = paso1Schema.safeParse({
        nombre: 'Juan',
        apellido: 'Perez',
        fechaNacimiento: '1990-01-01',
        cedula: '1234567',
        estadoCivil: 'soltero',
        telefono: '0981123456',
        email: '',
      });
      expect(result.success).toBe(true);

      // Undefined
      result = paso1Schema.safeParse({
        nombre: 'Juan',
        apellido: 'Perez',
        fechaNacimiento: '1990-01-01',
        cedula: '1234567',
        estadoCivil: 'soltero',
        telefono: '0981123456',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('paso2Schema', () => {
    it('should validate a correct payload', () => {
      const validData = {
        carrera: 'Ingeniería',
        aniosEstudio: 5,
        universidad: 'Universidad Nacional',
        estadoEstudios: 'en_curso',
        idiomas: [
          { idioma: 'Inglés', nivel: 'avanzado' },
          { idioma: 'Portugués', nivel: 'basico' }
        ],
      };

      const result = paso2Schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should coerce aniosEstudio to number and reject if out of bounds', () => {
      // Valid string coerced to number
      let result = paso2Schema.safeParse({
        carrera: 'Ingeniería',
        aniosEstudio: '5',
        universidad: 'Universidad Nacional',
        estadoEstudios: 'en_curso',
        idiomas: [],
      });
      expect(result.success).toBe(true);

      // Invalid number
      result = paso2Schema.safeParse({
        carrera: 'Ingeniería',
        aniosEstudio: 11, // max is 10
        universidad: 'Universidad Nacional',
        estadoEstudios: 'en_curso',
        idiomas: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid enum values', () => {
      const result = paso2Schema.safeParse({
        carrera: 'Ingeniería',
        aniosEstudio: 5,
        universidad: 'Universidad Nacional',
        estadoEstudios: 'abandonado', // invalid enum
        idiomas: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('formularioCompletoSchema', () => {
    it('should require all fields from all steps', () => {
      // Just testing a small subset to ensure it merges correctly
      // It should fail since it's missing almost everything
      const result = formularioCompletoSchema.safeParse({
        nombre: 'Juan',
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        // Just verify it complains about fields from different steps
        const paths = result.error.issues.map(i => i.path[0]);
        expect(paths).toContain('apellido'); // from paso1
        expect(paths).toContain('carrera'); // from paso2
        expect(paths).toContain('situacionActual'); // from paso3
        expect(paths).toContain('ciudad'); // from paso8
      }
    });
  });
});
