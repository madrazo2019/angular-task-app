import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  standalone: true,
  selector: 'app-task-item',
  imports: [],
  template: `
    <div class="task-card">
      <input type="checkbox" [checked]="task.completed" disabled />
      <span [class.completed]="task.completed">
        {{ task.title }}
      </span>
      <button type="button" style="margin-bottom: 5px;" class="btn btn-primary" (click)="onRemove()">Eliminar</button>
    </div>
  `,
  styles: ``,
})
export class TaskItem {

  @Input({ required: true }) task!: Task;
   @Output() remove = new EventEmitter<number>();

  onRemove() {
    this.remove.emit(this.task.id);
  }
}
