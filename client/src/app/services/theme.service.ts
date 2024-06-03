import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  activeTheme: string = 'dark';
  getTheme() {
    return this.activeTheme;
  }
  setTheme(theme: string) {
    let themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = theme + '.css';
    }
    this.activeTheme = theme;
    localStorage.setItem('theme', theme);

    // Remove existing theme classes
    document.body.classList.remove('dark-theme', 'light-theme');

    // Add the new theme class
    document.body.classList.add(`${theme}-theme`);
  }
}
