import { Component, ElementRef, ViewChild, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CatalogService } from '../../core/services/catalog/catalog.service';
import { CatalogItem } from '../../core/models/catalog-item';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit, OnDestroy {
  private catalog = inject(CatalogService);
  @ViewChild('carouselHost') host?: ElementRef<HTMLElement>;

  bestSellers = signal<CatalogItem[]>([
    { id: '1', name: 'Suporte Angular', description: 'Peça resistente para montagem rápida.', price: 39.9, category: 'Suportes', material: 'PLA', imageUrl: 'https://picsum.photos/seed/imp3d-1/1200/700', stock: 10 },
    { id: '2', name: 'Engrenagem Técnica', description: 'Alta precisão e excelente acabamento.', price: 59.9, category: 'Mecânica', material: 'PETG', imageUrl: 'https://picsum.photos/seed/imp3d-2/1200/700', stock: 8 },
    { id: '3', name: 'Caixa Modular', description: 'Organização perfeita para projetos.', price: 29.9, category: 'Acessórios', material: 'PLA', imageUrl: 'https://picsum.photos/seed/imp3d-3/1200/700', stock: 15 },
    { id: '4', name: 'Capa Custom', description: 'Design personalizado sob medida.', price: 49.9, category: 'Custom', material: 'ABS', imageUrl: 'https://picsum.photos/seed/imp3d-4/1200/700', stock: 6 }
  ]);

  activeIndex = signal(0);
  isPlaying = signal(true);
  private timer: any;
  private imageCache = new Map<string, string>();
  private objectUrls: string[] = [];

  constructor() {
    this.loadBestSellers();
  }

  ngAfterViewInit(): void {
    this.startAuto();
  }

  ngOnDestroy(): void {
    this.stopAuto();
    if (typeof window !== 'undefined') {
      this.objectUrls.forEach((u) => URL.revokeObjectURL(u));
    }
  }

  activeItem(): CatalogItem {
    const list = this.bestSellers();
    return list[this.activeIndex()] || list[0];
  }

  canNavigate(): boolean {
    return this.bestSellers().length > 1;
  }

  loadBestSellers(): void {
    this.catalog.getCatalog().subscribe({
      next: (items) => {
        const data = items && items.length ? items.slice(0, 8) : this.bestSellers();
        this.bestSellers.set(data);
        if (this.activeIndex() >= data.length) this.activeIndex.set(0);
        this.preloadImages(data);
      },
      error: () => {
        const data = this.bestSellers();
        this.bestSellers.set(data);
        this.preloadImages(data);
      }
    });
  }

  prevManual(): void {
    if (!this.canNavigate()) return;
    this.stopAuto();
    this.setActiveIndex((this.activeIndex() - 1 + this.bestSellers().length) % this.bestSellers().length);
  }

  nextManual(): void {
    if (!this.canNavigate()) return;
    this.stopAuto();
    this.advance();
  }

  togglePlay(): void {
    if (this.isPlaying()) this.stopAuto();
    else this.startAuto();
  }

  startAuto(): void {
    if (this.timer || !this.canNavigate()) {
      this.isPlaying.set(false);
      return;
    }
    this.isPlaying.set(true);
    this.timer = setInterval(() => this.advance(), 5000);
  }

  stopAuto(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.isPlaying.set(false);
  }

  private advance(): void {
    this.setActiveIndex((this.activeIndex() + 1) % this.bestSellers().length);
  }

  private setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }

  private preloadImages(items: CatalogItem[]): void {
    if (typeof window === 'undefined') return;
    Promise.all(items.map((item) => this.getCachedImage(item.imageUrl)))
      .then((urls) => {
        const updated = items.map((item, i) => ({ ...item, imageUrl: urls[i] || item.imageUrl }));
        this.bestSellers.set(updated);
      });
  }

  private async getCachedImage(url: string): Promise<string> {
    const cached = this.imageCache.get(url);
    if (cached) return cached;
    const res = await fetch(url, { cache: 'force-cache' });
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    this.imageCache.set(url, objectUrl);
    this.objectUrls.push(objectUrl);
    return objectUrl;
  }
}