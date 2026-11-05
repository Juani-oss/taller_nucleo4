import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import { Datos } from '../services/datos';
import { adminGuard } from './admin-guard';
import { authGuard } from './auth-guard';

const ejecutar = (guard: typeof authGuard) =>
  TestBed.runInInjectionContext(() =>
    guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
  );

const destino = (resultado: unknown) => TestBed.inject(Router).serializeUrl(resultado as never);

const iniciarCon = (rol?: string) => {
  localStorage.clear();
  if (rol) {
    localStorage.setItem('sesion', JSON.stringify({ nombre: 'x', email: 'x@x.com', rol }));
  }
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: Datos, useValue: {} }],
  });
};

describe('guards', () => {
  it('sin sesion ambos guards envian a login', () => {
    iniciarCon();

    expect(destino(ejecutar(authGuard))).toBe('/login');
    expect(destino(ejecutar(adminGuard))).toBe('/login');
  });

  it('el usuario estandar ve el catalogo pero no el panel', () => {
    iniciarCon('estandar');

    expect(ejecutar(authGuard)).toBe(true);
    expect(destino(ejecutar(adminGuard))).toBe('/catalogo');
  });

  it('el administrador accede a ambas rutas', () => {
    iniciarCon('admin');

    expect(ejecutar(authGuard)).toBe(true);
    expect(ejecutar(adminGuard)).toBe(true);
  });
});
