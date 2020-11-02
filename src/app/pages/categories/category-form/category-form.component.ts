import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string; // - Vai dizer se esta criando ou editando
  categoryForm: FormGroup; // Formolurio de categoria
  pageTitle: string; // Aparece o nome na página pra ver se é editando ou criando
  ServerErrorMenssages: string[] = null; // - Mensagem retornado do servidor
  submitingForm:boolean = false; // - Para quando clica em enviar, desativa para não enviar varias vezes
  category: Category = new Category(); //

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.builtCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void { //- Para Setar o título da pagina
    this.setPageTitle();
  }

  submitForm(): void {
    this.submitingForm = true;

    if(this.currentAction == 'new'){
      this.createCategory() //create novo formulario
    } else {
      this.updateCategory() //update edita o formulario
    }
  }

  // ----------- Private Methods --------------//

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
  }

  private builtCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if(this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe((category) => {
        this.category = category;
        this.categoryForm.patchValue(category) // Binds loader data to CategoryForm
      },
      (error) => alert('Ocorreu um erro no Servidor, tente mais tarde'))
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria'
    } else {
      const categoryName = this.category.name || ''
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value); //Cria uma nova categoria
    this.categoryService.create(category).subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
      )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
    )
  }

  private actionForSuccess(category: Category) {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    )
  }

  private actionForError(error) {
    toastr.error('Ocorreu um erro ao procurar a sua solicitação!');

    this.submitingForm = false

    if(error.status === 422) {
      this.ServerErrorMenssages = JSON.parse(error._body).errors;
    } else {
      this.ServerErrorMenssages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.']
    }
  }
}
