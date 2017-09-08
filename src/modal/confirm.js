import { createConfirmation } from 'react-confirm';
import ConfirmDialog from './ConfirmDialog';

const confirm = createConfirmation(ConfirmDialog);

/**
 * Expõe uma interface de uso do componente ConfirmDialog.
 * 
 * @param {string} dialogText - Texto de contexto do dialog
 * @param {object} options - opções de customização. Opções disponíveis: 
 * {
 *      cancelButtonText: texto do botão de cancelar
 *      confirmButtonText: texto do botão de confirmação
 *      confirmationText: texto do dialog
 *      title: título do dialog
 * }
 * 
 * Exemplo de uso:
 * 
 *    let options = { title: 'Salvar alterações', confirmButtonText: 'Salvar', cancelButtonText: 'Cancelar' };
 *
 *    confirm('Deseja salvar as alterações?', options).then(
 *      () => {
 *        //logica a ser executada quando usuário clicar no botão de confirm
 *      },
 *      () => {
 *        //logica a ser executada quando usuário clicar no botão de cancelar
 *      }
 *    );
 *  
 */
export default function(dialogText, options = {}) {
  return confirm({ dialogText, options });
}
