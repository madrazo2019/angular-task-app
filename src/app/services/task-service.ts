import { Injectable } from '@angular/core';
 import { HttpClient , HttpParams } from '@angular/common/http';
 import { inject } from '@angular/core';
import { Task } from '../models/task.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

   private tasks: Task[] = [];
  // Obtener la lista de tareas
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map(tasks => tasks.slice(0, 20)) // Limitar a 20 tareas para la demo
    );
  }
  // Eliminar una tarea
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
    

}
