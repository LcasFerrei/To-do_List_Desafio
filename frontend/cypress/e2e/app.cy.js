describe('Fluxo da Aplicação To-Do List', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/');
    });
  
    it('deve permitir ao usuário adicionar, concluir e deletar uma tarefa', () => {
      const taskTitle = 'Fazer o teste com Cypress';
      const taskDescription = 'Escrever um teste E2E completo.';
  
      // Preenche o campo de título da tarefa
      cy.get('input[placeholder="Título da tarefa"]').type(taskTitle);
  
      // Preenche o campo de descrição da tarefa
      cy.get('textarea[placeholder="Descrição (opcional)"]').type(taskDescription);
  
      // Clica no botão para adicionar a tarefa
      cy.get('button').contains('Adicionar Tarefa').click();
  
      // Verifica se a mensagem de sucesso apareceu
      cy.contains('Tarefa adicionada com sucesso!').should('be.visible');
  
      // Verifica se a tarefa foi adicionada na lista
      cy.contains('.task-item', taskTitle).should('be.visible');
  
      // Marca a tarefa como concluída clicando no botão de completar
      cy.contains('.task-item', taskTitle).within(() => {
        cy.get('button.btn-complete').click();
      });
  
      // Confirma se apareceu a mensagem de status atualizado
      cy.contains('Status da tarefa atualizado!').should('be.visible');
  
      // Verifica se a tarefa está com a classe que indica conclusão
      cy.contains('.task-item', taskTitle).should('have.class', 'completed');
  
      // Clica no botão de deletar a tarefa
      cy.contains('.task-item', taskTitle).within(() => {
        cy.get('button.btn-delete').click();
      });
  
      // Confirma se o modal de confirmação apareceu
      cy.contains('Tem certeza que deseja excluir esta tarefa?').should('be.visible');
  
      // Clica no botão de confirmar a exclusão
      cy.get('button.btn-confirm').click();
  
      // Verifica se a notificação de exclusão apareceu
      cy.contains('Boa! Mais um passo dado em direção aos seus objetivos!').should('be.visible');
  
      // Garante que a tarefa foi removida da lista
      cy.contains('.task-item', taskTitle).should('not.exist');
    });
  
    it('deve permitir a edição do título e descrição de uma tarefa', () => {
      const originalTitle = 'Tarefa para Editar';
      const updatedTitle = 'Tarefa Editada com Sucesso';
      const updatedDescription = 'A descrição também foi atualizada.';
  
      // Adiciona uma nova tarefa com o título original
      cy.get('input[placeholder="Título da tarefa"]').type(originalTitle);
      cy.get('button').contains('Adicionar Tarefa').click();
  
      // Verifica se a tarefa foi adicionada corretamente
      cy.contains('.task-item', originalTitle).should('be.visible');
  
      // Clica no botão de editar da tarefa
      cy.contains('.task-item', originalTitle).within(() => {
        cy.get('button.btn-edit').click();
      });
  
      // Confirma se o modal de edição apareceu
      cy.contains('h2', 'Editar Tarefa').should('be.visible');
  
      // Altera o título e a descrição no modal
      cy.get('.edit-form-wrapper input[placeholder="Título da tarefa"]').clear().type(updatedTitle);
      cy.get('.edit-form-wrapper textarea[placeholder="Descrição (opcional)"]').clear().type(updatedDescription);
  
      // Salva as alterações
      cy.get('.edit-form-wrapper button').contains('Salvar Alterações').click();
  
      // Verifica se a mensagem de sucesso apareceu
      cy.contains('Tarefa atualizada com sucesso!').should('be.visible');
  
      // Garante que a tarefa antiga não está mais visível
      cy.contains('.task-item', originalTitle).should('not.exist');
  
      // Confirma que a tarefa nova foi atualizada com o novo título e descrição
      cy.contains('.task-item', updatedTitle).should('be.visible');
      cy.contains('.task-item', updatedTitle).contains(updatedDescription).should('be.visible');
    });
  
    it('deve filtrar as tarefas por status', () => {
      // Adiciona duas tarefas
      cy.get('input[placeholder="Título da tarefa"]').type('Tarefa Pendente');
      cy.get('button').contains('Adicionar Tarefa').click();
      cy.get('input[placeholder="Título da tarefa"]').type('Tarefa a ser Concluída');
      cy.get('button').contains('Adicionar Tarefa').click();
  
      // Marca uma tarefa como concluída
      cy.contains('.task-item', 'Tarefa a ser Concluída').within(() => {
        cy.get('button.btn-complete').click();
      });
  
      // Aguarda um tempo para a interface atualizar
      cy.wait(500);
  
      // Filtra apenas tarefas concluídas
      cy.get('button.filter-btn').contains('Concluídas').click();
      cy.contains('.task-item', 'Tarefa a ser Concluída').should('be.visible');
      cy.contains('.task-item', 'Tarefa Pendente').should('not.exist');
  
      // Filtra tarefas pendentes
      cy.get('button.filter-btn').contains('Pendentes').click();
      cy.contains('.task-item', 'Tarefa Pendente').should('be.visible');
      cy.contains('.task-item', 'Tarefa a ser Concluída').should('not.exist');
  
      // Volta para ver todas as tarefas
      cy.get('button.filter-btn').contains('Todas').click();
      cy.contains('.task-item', 'Tarefa Pendente').should('be.visible');
      cy.contains('.task-item', 'Tarefa a ser Concluída').should('be.visible');
    });

    it.only('deve alternar entre modo claro e escuro', () => {
        //  Verifica o estado inicial (modo claro)
        cy.get('html').should('not.have.attr', 'data-theme', 'dark');
        cy.get('.theme-toggle-btn i').should('have.class', 'bxs-moon');
    
        // Clica no botão para ativar o modo escuro
        cy.get('.theme-toggle-btn').click();
    
        // Verifica se o modo escuro foi ativado
        cy.get('html').should('have.attr', 'data-theme', 'dark');
        cy.get('.theme-toggle-btn i').should('have.class', 'bxs-sun');
    
        // Clica novamente para voltar ao modo claro
        cy.get('.theme-toggle-btn').click();
    
        // Verifica se o modo claro foi restaurado
        cy.get('html').should('not.have.attr', 'data-theme', 'dark');
        cy.get('.theme-toggle-btn i').should('have.class', 'bxs-moon');
      });
  
    it('deve pesquisar tarefas pelo título', () => {
      // Adiciona duas tarefas com nomes diferentes
      cy.get('input[placeholder="Título da tarefa"]').type('Primeira tarefa de busca');
      cy.get('button').contains('Adicionar Tarefa').click();
      cy.get('input[placeholder="Título da tarefa"]').type('Segunda tarefa para encontrar');
      cy.get('button').contains('Adicionar Tarefa').click();
  
      // Faz uma pesquisa pelo termo "Primeira"
      cy.get('input[placeholder="Buscar por título..."]').type('Primeira');  // Bug para resolver, problema no modo de pesquisa, apenas no cypress
  
      // Verifica se apenas a tarefa com "Primeira" aparece
      cy.contains('.task-item', 'Primeira tarefa de busca').should('be.visible');
      cy.contains('.task-item', 'Segunda tarefa para encontrar').should('not.exist');
    });
  });
  