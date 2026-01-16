import { Component, inject, OnInit } from '@angular/core';
import { TaskItem } from './task-item/task-item';
import { Task } from './models/task.model';
import { TaskService } from './services/task-service';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TaskItem],
  template: `
  
<main class="container">
  <section>
    <h2>Lista de Tareas</h2>
    
    @if (loading) {
      <p>Cargando tareas...</p>
    }

    <div class="container">
      @for (task of tasks; track task.id) {
        <app-task-item 
          [task]="task" 
          (remove)="deleteTask($event)"
          (toggleComplete)="toggleTaskComplete($event)">
        </app-task-item>
      } @empty {
        @if (!loading) {
          <p>No hay tareas disponibles.</p>
        }
      }
    </div>
    
    @if (error) {
      <p class="error">{{ error }}</p>
    }
  </section>
</main>
  `,
  styles: ``,
})
export class AppComponent implements OnInit {
  private taskService = inject(TaskService);
  
  tasks: Task[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.getTasks();
  }

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

  deleteTask(id: number) {
    const previousTasks = [...this.tasks];
    this.tasks = this.tasks.filter(t => t.id !== id);

    this.taskService.deleteTask(id).subscribe({
      error: () => {
        alert('Error al eliminar la tarea');
        this.tasks = previousTasks;
      }
    });
  }

  toggleTaskComplete(id: number) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      const previousCompleted = task.completed;
      task.completed = !task.completed;

      this.taskService.updateTaskCompletion(id, task.completed).subscribe({
        next: () => {
          console.log(`Tarea ${id} marcada como ${task.completed ? 'completada' : 'incompleta'}`);
        },
        error: () => {
          // Si falla, revertimos el cambio
          task.completed = previousCompleted;
          alert('Error al actualizar el estado de la tarea');
          console.error(`Error al actualizar la tarea ${id}`);
        }
      });
    }
  }
}