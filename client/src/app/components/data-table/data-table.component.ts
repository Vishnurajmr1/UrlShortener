import {
  Component,
  inject,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { QrCodeModule } from 'ng-qrcode';
import { ApiService } from '../../services/api.service';
import { IApiUrl } from '../../shared/models/api';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { Column } from '../../shared/models/table';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    QrCodeModule,
    CommonModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  providers: [MessageService],
})
export class DataTableComponent {
  @ViewChild('copyButton') copyButton?: ElementRef<any>;
  tableData: IApiUrl[] = [];
  private apiService = inject(ApiService);
  private messageService = inject(MessageService);
  private render2 = inject(Renderer2);
  private destroy$ = new Subject<void>();
  shortUrl: string = '';
  cols!: Column[];
  counter: number = 0;
  deleteMessage: string = '';
  buttonDisbaled: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.apiService.urlData$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (data != null) {
          this.shortUrl = data.id;
          this.tableData = [...this.tableData, data];
          console.log(this.tableData);
        }
      },
    });

    this.cols = [
      { field: 'shorturl', header: 'ShortUrl' },
      { field: 'sriginalurl', header: 'OriginalUrl' },
      { field: 'qrcode', header: 'QrCode' },
      { field: 'clicks', header: 'Clicks' },
      { field: 'date', header: 'Date' },
      { field: '', header: '' },
    ];
  }
  getUrl(shortId: string): string {
    return `${environment.baseUrl}/url/${shortId}`;
  }
  redirectToUrl(shortId: string, event: MouseEvent) {
    event.stopPropagation();
    window.open(this.getUrl(shortId), '_blank');
  }

  copyToCliboard(id: string, event: MouseEvent): void {
    event.stopPropagation();
    const shortUrl = this.getUrl(id);
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => {
        this.render2.setAttribute(
          this.copyButton?.nativeElement,
          'title',
          'Copied'
        );
        // const button=event.target as HTMLButtonElement;
        // console.log(button)
        // button.title='Copied';
        const dataRow = this.findDataRowByUrl(id);
        if (dataRow) {
          this.buttonDisbaled[id] = true;
          setTimeout(() => {
            this.buttonDisbaled[id] = false;
            this.render2.removeAttribute(
              this.copyButton?.nativeElement,
              'title'
            );
            // button.title='';
          }, 5000);
        }
      })
      .catch((err) => {
        console.error('Could not copy text', err);
      });
  }

  findDataRowByUrl(urlId: string) {
    return this.tableData.find((data) => data.id === urlId);
  }
  deleteShortUrl(shortId: string) {
    console.log(shortId);
    this.apiService.deleteShortUrl(shortId).subscribe({
      next: (response) => {
        this.deleteMessage = response.message;
        this.messageService.add({
          severity: 'success',
          summary: 'URL deleted',
          detail: this.deleteMessage,
          life: 3000,
        });
        this.tableData = this.tableData.filter((data) => data.id !== shortId);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
          life: 3000,
        });
      },
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
