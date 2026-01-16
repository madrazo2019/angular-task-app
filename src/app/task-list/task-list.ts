import { Component, inject ,Input, Output } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task-service';
import { finalize } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { TaskItem}  from '../task-item/task-item';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [TaskItem],
template: `
 <section>
<h2>Lista de Tareas</h2>
    
    @if (loading) {
      <p>Cargando tareas...</p>
    }

    @if (error) {
      <p class="error">{{ error }}</p>
    }

    <div class="container">
      @for (task of tasks; track task.id) {
        <app-task-item 
          [task]="task" 
          (remove)="deleteTask($event)"
          (toggleComplete)="toggleTask($event)">
        </app-task-item>
      } @empty {
        @if (!loading) {
          <p>No hay tareas disponibles.</p>
        }
      }
    </div> 
 </section>
  `,

  styles: ``,
})
export class TaskList {
 private taskService = inject(TaskService);
  @Input() tasks: Task[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

@Output() remove = new EventEmitter<number>();
@Output() toggleComplete = new EventEmitter<number>();

  getTasks() {
    this.loading = true;
    this.taskService.getTasks()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: tasks => {
          this.tasks = tasks;
          this.error = null;
        },
        error: err => {
          this.error = 'No se pudieron cargar las tareas.';
          this.tasks = [];
          console.error('Error al cargar tareas:', err);
        }
      });
   }
  

  ngOnInit() {
    this.getTasks();
  }

  deleteTask(id: number) {
    // Optimista: eliminamos de la UI primero para mejor experiencia
    const previousTasks = [...this.tasks];
    this.tasks = this.tasks.filter(t => t.id !== id);

    this.taskService.deleteTask(id).subscribe({
      error: () => {
        // Si falla, revertimos el cambio (rollback)
        alert('Error al eliminar la tarea');
        this.tasks = previousTasks;
      }
    });
  }

  toggleTask(id: number) {
    this.toggleComplete.emit(id);
  }
}
