import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Ingrediente } from 'src/app/models/ingrediente';
import { IngredienteService } from 'src/app/services/ingrediente.service';

@Component({
  selector: 'app-ingredientes',
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.css'],
})
export class IngredientesComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'unidad_medida',
    'stock',
    'estado', // Nueva columna
    'modified_at',
    'acciones',
  ];
  dataSource = new MatTableDataSource<Ingrediente>();
  showRegisterForm: boolean = false;
  showAddStockForm: boolean = false;
  registerForm: FormGroup;
  addStockForm: FormGroup;
  editMode: boolean = false;
  currentIngredienteId: string | null = null;

  unidadesMedida: string[] = [
    'GRAMOS',
    'KILOGRAMOS',
    'LITROS',
    'MILILITROS',
    'UNIDAD',
    'OTRO',
  ];

  constructor(
    private ingredienteService: IngredienteService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      unidad_medida: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      stock_min: ['', [Validators.required, Validators.min(0)]],
    });

    this.addStockForm = this.fb.group({
      agregar_stock: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.loadIngredientes();
  }

  loadIngredientes(): void {
    this.ingredienteService.getIngredientes().subscribe({
      next: (data: Ingrediente[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al cargar los ingredientes', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  openRegisterForm(): void {
    this.showRegisterForm = true;
    this.editMode = false;
    this.currentIngredienteId = null;
    this.registerForm.reset();
  }

  closeRegisterForm(): void {
    this.showRegisterForm = false;
    this.registerForm.reset();
  }
  openAddStockForm(ingrediente: Ingrediente): void {
    this.currentIngredienteId = ingrediente.id_ingrediente;
    this.showAddStockForm = true;
    this.addStockForm.reset();
  }

  closeAddStockForm(): void {
    this.showAddStockForm = false;
    this.addStockForm.reset();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      if (this.editMode && this.currentIngredienteId) {
        this.ingredienteService
          .updateIngrediente(this.currentIngredienteId, this.registerForm.value)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Ingrediente actualizado exitosamente',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
              this.loadIngredientes();
              this.registerForm.reset();
              this.closeRegisterForm();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open(
                'Error al actualizar el ingrediente',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            },
          });
      } else {
        this.ingredienteService
          .registerIngrediente(this.registerForm.value)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Ingrediente registrado exitosamente',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
              this.loadIngredientes();
              this.registerForm.reset();
              this.closeRegisterForm();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open(
                'Error al registrar el ingrediente',
                'Cerrar',
                {
                  duration: 3000,
                }
              );
            },
          });
      }
    }
  }

  onAddStockSubmit(): void {
    if (this.addStockForm.valid && this.currentIngredienteId) {
      this.ingredienteService
        .addStock(this.currentIngredienteId, this.addStockForm.value)
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

  editIngrediente(ingrediente: Ingrediente): void {
    this.currentIngredienteId = ingrediente.id_ingrediente;
    this.editMode = true;
    this.showRegisterForm = true;
    this.registerForm.patchValue(ingrediente);
  }

  deleteIngrediente(ingrediente: Ingrediente): void {
    this.ingredienteService
      .deleteIngrediente(ingrediente.id_ingrediente)
      .subscribe({
        next: (response) => {
          this.snackBar.open(response, 'Cerrar', {
            duration: 3000,
          });
          this.loadIngredientes();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al eliminar el ingrediente', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  activateIngrediente(ingrediente: Ingrediente): void {
    const data = { estado: 'ACTIVO' };
    this.ingredienteService
      .updateIngrediente(ingrediente.id_ingrediente, data)
      .subscribe({
        next: () => {
          this.snackBar.open('Ingrediente activado exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.loadIngredientes();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al activar el ingrediente', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }
}
