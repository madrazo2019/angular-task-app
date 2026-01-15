import { Component, inject } from '@angular/core';
import { TaskList} from './task-list/task-list';
//import { finalize } from 'rxjs';

//import { TaskService } from './services/task-service';
//import { App } from './app';
@Component({
  selector: 'app-root',
  imports: [TaskList],
  template: `
  
<main class="container">
     <main>
      <app-task-list></app-task-list>
    </main>
</main>
  `,
  styles: ``,
})
export class AppComponent {
  }

  