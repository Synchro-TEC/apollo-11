import React from 'react';
import PropTypes from 'prop-types';
import { confirmable } from 'react-confirm';
import { SkyLightStateless } from 'react-skylight';
import _merge from 'lodash/merge';

/**
 * Renderiza um modal de confirmação.
 *
 * @param title - título padrão do modal. Pode ser sobrescrito informando <pre>title</pre> no atributo <pre>options</pre>
 * @param confirmButtonText - texto a ser exibido no botão de confirmar a ação (default: 'Sim')
 * @param cancelButtonText - texto a ser exibido no botão de cancelar a ação (default: 'Não')
 * @param show - boolean dizendo se mostra ou não o dialog
 * @param dialogText - String que sera a mensagem do corpo do modal. Pode ser conteúdo HTML
 * @param proceed - função a ser executada ao clicar no botão Sim
 * @param dismiss - função a ser executada ao clicar ao fechar o modal
 * @param cancel - função a ser executada ao clicar no botão Não
 * @param options - Objeto que contem os paramêtros utilizados no modal
 */
function ConfirmDialog({
  title,
  confirmButtonText,
  cancelButtonText,
  show,
  dialogText,
  proceed,
  dismiss,
  cancel,
  options,
}) {
  let width = window.screen.availWidth;
  const defaultStyles = {
    dialogStyles: {
      width: '400px',
      height: '250px',
      position: 'fixed',
      top: '50%',
      left: width < 1025 ? '54%' : '64%',
      borderRadius: '2px',
      zIndex: '100',
      padding: '15px',
      boxShadow: 'rgba(0, 0, 0, 0.137255) 0px 0px 4px, rgba(0, 0, 0, 0.278431) 0px 4px 8px',
      display: 'block',
      backgroundColor: 'rgb(255, 255, 255)',
    },
  };

  const styles = _merge(defaultStyles, options.styles);

  return (
    <SkyLightStateless
      dialogStyles={styles.dialogStyles}
      isVisible={show}
      onCloseClicked={dismiss}
      onOverlayClicked={dismiss}
      title={options.title ? options.title : title}
      titleStyle={styles.title}
    >
      <hr />

      <div className="sv-mt--5">
        <div className="sv-text-center sv-mb--10 ">
          <span dangerouslySetInnerHTML={{ __html: dialogText }} />
        </div>

        <div>
          <div className="sv-row">
            <div className="sv-column sv-mt--30 sv-mh--10">
              <button className="sv-button out-danger" onClick={cancel} type="button">
                <i className="fa fa-ban" /> {options.cancelButtonText ? options.cancelButtonText : cancelButtonText}
              </button>
              <button className="sv-button primary sv-pull-right " onClick={proceed} type="button">
                <i className="fa fa-check" />{' '}
                {options.confirmButtonText ? options.confirmButtonText : confirmButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SkyLightStateless>
  );
}

ConfirmDialog.displayName = 'ConfirmDialog';

ConfirmDialog.propTypes = {
  cancel: PropTypes.func, // from confirmable. chamado ao fechar o dialog com a promise rejeitada.
  cancelButtonText: PropTypes.string, // texto do botão de cancelar
  confirmButtonText: PropTypes.string, // texto do botão de confirmação
  dialogText: PropTypes.string, // texto do dialog
  dismiss: PropTypes.func, // from confirmable. call to only close the dialog.
  options: PropTypes.object, // arguments of your confirm function
  proceed: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
  show: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
  title: PropTypes.string, // título do dialog
};

ConfirmDialog.defaultProps = {
  title: 'Excluir',
  confirmButtonText: 'Sim',
  cancelButtonText: 'Não',
};

export default confirmable(ConfirmDialog);
