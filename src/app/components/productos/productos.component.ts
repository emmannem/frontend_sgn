import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Ingrediente } from 'src/app/models/ingrediente';
import { Producto } from 'src/app/models/producto';
import { IngredienteService } from 'src/app/services/ingrediente.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'SKU',
    'precio',
    'modified_at',
    'estado',
    'stock',
    'acciones',
  ];
  displayedColumnsPreparados: string[] = [
    'nombre',
    'descripcion',
    'SKU',
    'precio',
    'estado',
    'acciones',
  ];
  dataSource = new MatTableDataSource<Producto>();
  dataSourcePreparados = new MatTableDataSource<Producto>();
  showingProductos = true;
  showRegisterForm: boolean = false;
  showAddStockForm: boolean = false;
  registerForm: FormGroup;
  addStockForm: FormGroup;
  editMode: boolean = false;
  currentProductoId: string | null = null;

  constructor(
    private productoService: ProductoService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      SKU: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
    });

    this.addStockForm = this.fb.group({
      stock: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al cargar los productos', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  loadProductosPreparados(): void {
    this.productoService.getProductosPreparados().subscribe({
      next: (data: Producto[]) => {
        this.dataSourcePreparados.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(
          'Error al cargar los productos preparados',
          'Cerrar',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  toggleView(view: string): void {
    if (view === 'productos') {
      this.showingProductos = true;
      this.loadProductos();
    } else {
      this.showingProductos = false;
      this.loadProductosPreparados();
    }
  }

  openRegisterForm(): void {
    this.showRegisterForm = true;
    this.editMode = false;
    this.currentProductoId = null;
    this.registerForm.reset();
  }

  closeRegisterForm(): void {
    this.showRegisterForm = false;
    this.registerForm.reset();
  }

  openAddStockForm(producto: Producto): void {
    this.currentProductoId = producto.id_producto;
    this.showAddStockForm = true;
    this.addStockForm.reset();
  }

  closeAddStockForm(): void {
    this.showAddStockForm = false;
    this.addStockForm.reset();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const productData = {
        ...this.registerForm.value,
        precio: parseFloat(this.registerForm.value.precio),
        stock: parseInt(this.registerForm.value.stock, 10),
      };

      if (this.editMode && this.currentProductoId) {
        this.productoService
          .updateProducto(this.currentProductoId, productData)
          .subscribe({
            next: (data: Producto) => {
              this.snackBar.open(
                'Producto actualizado exitosamente',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
              this.loadProductos();
              this.registerForm.reset();
              this.closeRegisterForm();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error al actualizar el producto', 'Cerrar', {
                duration: 3000,
              });
            },
          });
      } else {
        this.productoService.registerProducto(productData).subscribe({
          next: (data: Producto) => {
            this.snackBar.open('Producto registrado exitosamente', 'Cerrar', {
              duration: 3000,
            });
            this.loadProductos();
            this.registerForm.reset();
            this.closeRegisterForm();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Error al registrar el producto', 'Cerrar', {
              duration: 3000,
            });
          },
        });
      }
    }
  }

  onAddStockSubmit(): void {
    if (this.addStockForm.valid && this.currentProductoId) {
      const stockData = {
        stock: parseInt(this.addStockForm.value.stock, 10),
      };

      this.productoService
        .addStock(this.currentProductoId, stockData)
        .subscribe({
          next: () => {
            this.snackBar.open('Producto actualizado correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.loadProductos();
            this.addStockForm.reset();
            this.closeAddStockForm();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Error al agregar stock', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    }
  }

  editProducto(producto: Producto): void {
    this.currentProductoId = producto.id_producto;
    this.editMode = true;
    this.showRegisterForm = true;
    this.registerForm.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      SKU: producto.SKU,
      precio: producto.precio.toString(),
      stock: producto.inventario.stock.toString(),
    });
  }

  deleteProducto(producto: Producto): void {
    this.productoService.deleteProducto(producto.id_producto).subscribe({
      next: () => {
        this.snackBar.open('Producto inhabilitado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.loadProductos();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al eliminar el producto', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  activateProducto(producto: Producto): void {
    const data = { estado: 'ACTIVO' };
    this.productoService.updateProducto(producto.id_producto, data).subscribe({
      next: () => {
        this.snackBar.open('Producto activado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.loadProductos();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al activar el producto', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
