import { Component, OnInit } from '@angular/core';

import { CategoryService } from "../shared/category.service";
import { Category } from "../shared/category.model";
import { element } from 'protractor';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(
      category => this.categories = category,
      error => alert('Erro ao carregar a lista')
    )
  }

  deleteCategory(category): void {

    const mustDelete = confirm('Tem certeza que deseja excluir o item');

    if(mustDelete) {
      this.categoryService.delete(category.id).subscribe(() => {
        this.categories = this.categories.filter(element => element != category),
        () => alert('Erro ao tentar excluir')
      });
    }
  }

}

