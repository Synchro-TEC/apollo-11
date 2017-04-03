# Change Log
Todas as mudanças consideráveis serão documentadas neste arquivo.

Este formato de changelog foi baseado em [Keep a Changelog](http://keepachangelog.com/)
e esse projeto adere ao [Semantic Versioning](http://semver.org/).

## [0.3.5] - 2017-4-3
### Adicionado
- O filtro agora possui uma propriedade chamada onClearAll para executar callbacks.
- O filtro possui novas propriedades que lhe permitem modificar a label dos botões "aplicar filtro", "cancelar", "limpar filtro" e "filtro".
- O campo de busca do filtro agora possui um botão que pode ser utilizado para limpar este campo.

### Modificado
- No filtro, a propriedade principal que executa um callback quando usuário faz a busca teve seu nome alterado de onSearch para onFilter.
- No filtro, o valor padrão das labels dos botões de ação, foram colocadas em português.

### Corrigido
- Ao pressionar o enter nas opções do filtro, elas continuarão abertas.
- Ao aplicar o filtro, as opções do filtro serão fechadas.
- Ao limpar o filtro, as opções do filtro serão fechadas.
- No filtro,  não aparecerão mais warnings desnecessários em colunas que não são ordenáveis.
