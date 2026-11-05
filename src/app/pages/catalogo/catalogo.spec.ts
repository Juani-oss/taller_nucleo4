import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Datos } from '../../services/datos';
import { Catalogo } from './catalogo';

describe('Catalogo', () => {
  it('muestra los productos sin opciones de gestion', async () => {
    const listar = vi.fn().mockReturnValue(
      of([{ id: 'p1', nombre: 'Laptop', categoria: 'Laptops', marca: 'Lenovo', precio: 650, stock: 8 }])
    );
    TestBed.configureTestingModule({ providers: [{ provide: Datos, useValue: { listar } }] });

    const fixture = TestBed.createComponent(Catalogo);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;

    expect(html.textContent).toContain('Laptop');
    expect(html.querySelector('button')).toBeNull();
  });
});
