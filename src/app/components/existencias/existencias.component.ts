import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Ingrediente } from 'src/app/models/ingrediente';
import { Producto } from 'src/app/models/producto';
import { IngredienteService } from 'src/app/services/ingrediente.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-existencias',
  templateUrl: './existencias.component.html',
  styleUrls: ['./existencias.component.css']
})
export class ExistenciasComponent {
  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'SKU',
    'precio',
    // 'modified_at',
    'estado',
    'stock',
    'acciones',
  ];

  dataSource = new MatTableDataSource<Producto>();
  dataSourceIngredientes = new MatTableDataSource<Ingrediente>();
  showingProductos = true;
  showAddStockForm: boolean = false;
  addStockForm: FormGroup;
  editMode: boolean = false;
  currentProductoId: string | null = null;
  displayedColumnsIng: string[] = [
    'nombre',
    'unidad_medida',
    'stock',
    'estado', // Nueva columna
    // 'modified_at',
    'acciones',
  ];

  constructor(
    private ingredienteService: IngredienteService,
    private productoService: ProductoService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {

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

  loadIngredientes(): void {
    this.ingredienteService.getIngredientes().subscribe({
      next: (data: Ingrediente[]) => {
        this.dataSourceIngredientes.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al cargar los ingredientes', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  toggleView(view: string): void {
    if (view === 'productos') {
      this.showingProductos = true;
      this.loadProductos();
    } else {
      // TODO: Cargar Ingredientes
      this.showingProductos = false;
      this.loadIngredientes();
    }
  }



  openAddStockFormIng(ingredientes: Ingrediente): void {
    this.currentProductoId = ingredientes.id_ingrediente;
    this.showAddStockForm = true;
    this.addStockForm.reset();
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


  onAddStockSubmit(): void {
    if (this.addStockForm.valid && this.currentProductoId) {
      if (this.showingProductos) {
        console.log(this.addStockForm.value)
        this.productoService
          .addStock(this.currentProductoId, this.addStockForm.value)
          .subscribe({
            next: () => {
              this.snackBar.open('Stock agregado exitosamente', 'Cerrar', {
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
      } else {
        this.ingredienteService.addStock(this.currentProductoId, { agregar_stock: this.addStockForm.value.stock })
          .subscribe({
            next: () => {
              this.snackBar.open('Stock agregado exitosamente', 'Cerrar', {
                duration: 3000,
              });
              this.loadIngredientes();
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
