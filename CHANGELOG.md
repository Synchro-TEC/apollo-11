# Change Log
Todas as mudanças consideráveis serão documentadas neste arquivo.

Este formato de changelog foi baseado em [Keep a Changelog](http://keepachangelog.com/)
e esse projeto adere ao [Semantic Versioning](http://semver.org/).

## [0.4.6] - 2017-5-5
### Modificado
- Melhorias no processo de build, mudado da pasta lib para distribution e ajustes no npm ignore.

## [0.4.5] - 2017-5-5
### Modificado
- Melhorias no processo de build, agora limpamos a pasta lib antes de uma nova build.

### Corrigido
- Correção da issue #18
- Correção da paginação, que não estava mantendo o número de registro por página corretamente.

## [0.4.4] - 2017-5-5
### Adicionado
- Adicionado o componente inputDate

### Modificado
- Novo processo de build, usando o babel.
- Ajustes no travel CI.


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
