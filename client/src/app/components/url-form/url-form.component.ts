import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-url-form',
  standalone: true,
  imports: [
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextareaModule,
  ],
  templateUrl: './url-form.component.html',
  styleUrl: './url-form.component.scss',
})
export class UrlFormComponent {
  urlValue: string = '';

  onSubmit(){
    console.log(this.urlValue)
    this.urlValue=''
  }
}
