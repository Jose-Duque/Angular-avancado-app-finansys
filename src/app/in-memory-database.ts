import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Category } from './pages/categories/shared/category.model'

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      {id: 1, name: 'Moradia', description: 'Pagamentos de contas da casa'},
      {id: 2, name: 'Saude', description: 'Planos de saúde e remedios'},
      {id: 3, name: 'Lazer', description: 'cinema, parques, praia, etc'},
      {id: 4, name: 'Salário', description: 'Recebimento de salário'},
      {id: 5, name: 'Freelas', description: 'trabalho como freelance'}
    ]

    return {categories}
  }
}
