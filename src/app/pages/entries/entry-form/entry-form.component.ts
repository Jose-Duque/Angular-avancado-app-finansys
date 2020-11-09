import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import { switchMap } from "rxjs/operators";

import toastr from "toastr";


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string; // - Vai dizer se esta criando ou editando
  entryForm: FormGroup; // Formolurio de Lançamento
  pageTitle: string; // Aparece o nome na página pra ver se é editando ou criando
  ServerErrorMenssages: string[] = null; // - Mensagem retornado do servidor
  submitingForm:boolean = false; // - Para quando clica em enviar, desativa para não enviar varias vezes
  entry: Entry = new Entry(); //
  categories: Array<Category>

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix:',',
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
    ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.builtEntryForm();
    this.loadEntry();
    this.loadcategory();
  }

  ngAfterContentChecked(): void { //- Para Setar o título da pagina
    this.setPageTitle();
  }

  submitForm(): void {
    this.submitingForm = true;

    if(this.currentAction == 'new'){
      this.createEntry() //create novo formulario
    } else {
      this.updateEntry() //update edita o formulario
    }
  }

  get typeOption():Array<any> {
    return Object.entries(Entry.types).map(([value, text]) => {
      return {
        value: value,
        text: text
      }
    })
  }

  // ----------- Private Methods --------------//

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
  }

  private builtEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense',[Validators.required]],
      amount: [null,[Validators.required]],
      date: [null,[Validators.required]],
      paid: [true,[Validators.required]],
      categoryId: [null,[Validators.required]],
    });
  }

  private loadEntry() {
    if(this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      ).subscribe((entry) => {
        this.entry = entry;
        this.entryForm.patchValue(entry) // Binds loader data to EntryForm
      },
      (error) => alert('Ocorreu um erro no Servidor, tente mais tarde'))
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro um Novo Lançamento'
    } else {
      const entryName = this.entry.name || ''
      this.pageTitle = 'Editar Lançamento: ' + entryName;
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value); //Cria uma nova categoria
    this.entryService.create(entry).subscribe(
      entry => this.actionForSuccess(entry),
      error => this.actionForError(error)
      )
  }

  private loadcategory() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry).subscribe(
      entry => this.actionForSuccess(entry),
      error => this.actionForError(error)
    )
  }

  private actionForSuccess(entry: Entry) {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
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
