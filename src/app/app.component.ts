import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Country } from './model/country.model';
import { CountryService } from './service/country.service';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'code', 'phoneCode'];
  dataSource = new MatTableDataSource<Country>([]);
  pageSizeOptions = [10, 25, 50, 100];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  countries: Country[];
  searchControl = new FormControl('');

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadCountries();
    this.initSearchForm();
  }

  private loadCountries(): void {
    this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries;
      this.paginator.length = this.countries.length;
      this.dataSource.data = this.countries;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private initSearchForm(): void {
    this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(100))
      .subscribe((value: string) => {
        if (!value) {
          this.dataSource.data = this.countries;
        }

        value = value.toLocaleLowerCase();
        this.dataSource.data = this.countries.filter((country) => {
          return (
            country.id.toString().includes(value) ||
            country.name.toLocaleLowerCase().includes(value) ||
            country.code.toLocaleLowerCase().includes(value) ||
            country.phoneCode.toLocaleLowerCase().includes(value)
          );
        });
      });
  }
}
