import { Component } from '@angular/core';
import { UrlFormComponent } from '../url-form/url-form.component';
import { DataTableComponent } from '../data-table/data-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UrlFormComponent,DataTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
