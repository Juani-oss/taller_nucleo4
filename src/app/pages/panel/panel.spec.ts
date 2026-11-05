import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Producto } from '../../models';
import { Datos, PRODUCTOS } from '../../services/datos';
import { Panel } from './panel';

const LAPTOP: Producto = { id: 'p1', nombre: 'Laptop', categoria: 'Laptops', marca: 'Lenovo', precio: 650, stock: 8 };

describe('Panel', () => {
  const datos = { listar: vi.fn(), crear: vi.fn(), actualizar: vi.fn(), eliminar: vi.fn() };

  const crearPanel = () => {
    TestBed.configureTestingModule({ providers: [{ provide: Datos, useValue: datos }] });
    return TestBed.createComponent(Panel).componentInstance;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    datos.listar.mockReturnValue(of([LAPTOP]));
    datos.crear.mockReturnValue(of({}));
    datos.actualizar.mockReturnValue(of({}));
    datos.eliminar.mockReturnValue(of({}));
  });

  it('carga los productos al iniciar', () => {
    expect(crearPanel().productos()).toEqual([LAPTOP]);
  });

  it('crea un producto y limpia el formulario', () => {
    const panel = crearPanel();
    panel.nombre.set('Mouse');
    panel.categoria.set('Perifericos');
    panel.marca.set('Logitech');
    panel.precio.set(18);
    panel.stock.set(50);
    panel.imagen.set('https://ejemplo.test/mouse.png');

    panel.guardar();

    expect(datos.crear).toHaveBeenCalledWith(PRODUCTOS, {
      nombre: 'Mouse', categoria: 'Perifericos', marca: 'Logitech', precio: 18, stock: 50,
      imagen: 'https://ejemplo.test/mouse.png',
    });
    expect(panel.nombre()).toBe('');
    expect(panel.imagen()).toBe('');
    expect(datos.listar).toHaveBeenCalledTimes(2);
  });

  it('edita un producto existente sin enviar el id en el contenido', () => {
    const panel = crearPanel();
    panel.editar(LAPTOP);
    panel.precio.set(700);

    panel.guardar();

    expect(datos.actualizar).toHaveBeenCalledWith(PRODUCTOS, 'p1', {
      nombre: 'Laptop', categoria: 'Laptops', marca: 'Lenovo', precio: 700, stock: 8, imagen: '',
    });
    expect(datos.crear).not.toHaveBeenCalled();
    expect(panel.editandoId()).toBe('');
  });

  it('elimina solo si se confirma', () => {
    const panel = crearPanel();

    vi.stubGlobal('confirm', () => false);
    panel.eliminar(LAPTOP);
    expect(datos.eliminar).not.toHaveBeenCalled();

    vi.stubGlobal('confirm', () => true);
    panel.eliminar(LAPTOP);
    expect(datos.eliminar).toHaveBeenCalledWith(PRODUCTOS, 'p1');

    vi.unstubAllGlobals();
  });
});
