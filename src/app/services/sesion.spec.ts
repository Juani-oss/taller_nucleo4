import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { Usuario } from '../models';
import { Datos, USUARIOS } from './datos';
import { Sesion } from './sesion';

const ADMIN: Usuario = {
  nombre: 'Administrador',
  email: 'admin@tienda.com',
  password: '8db1697902516ec2dc59fdd846f9a1ee238efd21c130bcda905010d26954b995',
  rol: 'admin',
};

describe('Sesion', () => {
  const datos = { buscar: vi.fn(), crear: vi.fn() };

  beforeEach(() => {
    localStorage.clear();
    datos.buscar.mockReset();
    datos.crear.mockReset();
    TestBed.configureTestingModule({ providers: [{ provide: Datos, useValue: datos }] });
  });

  it('inicia sesion como admin sin guardar la contrasena', async () => {
    datos.buscar.mockReturnValue(of([ADMIN]));
    const sesion = TestBed.inject(Sesion);

    expect(await firstValueFrom(sesion.login(' ADMIN@tienda.com ', 'admin123'))).toBe(true);
    expect(datos.buscar).toHaveBeenCalledWith(USUARIOS, 'email', 'admin@tienda.com');
    expect(sesion.esAdmin()).toBe(true);
    expect(localStorage.getItem('sesion')).not.toContain(ADMIN.password);
  });

  it('rechaza una contrasena incorrecta', async () => {
    datos.buscar.mockReturnValue(of([ADMIN]));
    const sesion = TestBed.inject(Sesion);

    expect(await firstValueFrom(sesion.login('admin@tienda.com', 'mala'))).toBe(false);
    expect(sesion.autenticado()).toBe(false);
  });

  it('registra usuarios nuevos siempre como estandar y con la contrasena cifrada', async () => {
    datos.buscar.mockReturnValue(of([]));
    datos.crear.mockReturnValue(of({}));
    const sesion = TestBed.inject(Sesion);

    expect(await firstValueFrom(sesion.registrar('Ana', 'ana@tienda.com', 'secreto1'))).toBe(true);
    const [coleccion, nuevo] = datos.crear.mock.calls[0];
    expect(coleccion).toBe(USUARIOS);
    expect(nuevo.rol).toBe('estandar');
    expect(nuevo.password).toMatch(/^[0-9a-f]{64}$/);
  });

  it('no registra un correo repetido', async () => {
    datos.buscar.mockReturnValue(of([ADMIN]));
    const sesion = TestBed.inject(Sesion);

    expect(await firstValueFrom(sesion.registrar('Otro', 'admin@tienda.com', 'secreto1'))).toBe(false);
    expect(datos.crear).not.toHaveBeenCalled();
  });

  it('restaura la sesion guardada y la cierra', () => {
    localStorage.setItem('sesion', JSON.stringify({ nombre: 'Ana', email: 'a@a.com', rol: 'estandar' }));
    const sesion = TestBed.inject(Sesion);

    expect(sesion.autenticado()).toBe(true);
    expect(sesion.esAdmin()).toBe(false);

    sesion.cerrar();

    expect(sesion.autenticado()).toBe(false);
    expect(localStorage.getItem('sesion')).toBeNull();
  });

  it('ignora una sesion guardada con formato invalido', () => {
    localStorage.setItem('sesion', '{invalido');

    expect(TestBed.inject(Sesion).autenticado()).toBe(false);
  });
});
