import { TestBed } from '@angular/core/testing';

import { Catalog } from './catalog.service';

describe('Catalog', () => {
  let service: Catalog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Catalog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
