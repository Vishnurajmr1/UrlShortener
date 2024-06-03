import { Component } from '@angular/core';
import { UrlFormComponent } from '../url-form/url-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [UrlFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
