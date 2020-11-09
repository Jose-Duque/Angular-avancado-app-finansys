import { Component, OnInit } from '@angular/core';

import { EntryService } from "../shared/entry.service";
import { Entry } from "../shared/entry.model";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) {}

  ngOnInit(): void {
    this.entryService.getAll().subscribe(
      entry => this.entries = entry.sort((a, b) => b.id - a.id),
      error => alert('Erro ao carregar a lista')
    )
  }

  deleteEntry(entry): void {

    const mustDelete = confirm('Tem certeza que deseja excluir o item');

    if(mustDelete) {
      this.entryService.delete(entry.id).subscribe(() => {
        this.entries = this.entries.filter(element => element != entry),
        () => alert('Erro ao tentar excluir')
      });
    }
  }

}

