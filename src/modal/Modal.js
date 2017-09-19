import React from 'react';
import PropTypes from 'prop-types';
import { SkyLightStateless } from 'react-skylight';

/**
 * Encapsula a lógica de montagem de modal.
 *
 * @param title - título do modal
 * @param type - tipo do modal. Valores aceitos: 'SMALL', 'MEDIUM', 'LARGE', 'CUSTOM'
 * @param customStyle - para modais do tipo CUSTOM, este atributo contém um objeto com as propriedades de estilo a serem aplicadas
 * @param show - indica se deve ser exibido
 * @param close - função a ser executada ao clicar no botão de fechar o modal
 * @param children - conteúdo a ser renderizado no modal
 * @param cancelButtonText - texto do botão que cancela a operação (fecha o modal)
 * @param confirmButtonText - texto do botão de sucesso
 * @param showButtons - indica se devem ser exibidos botões (cancelar e confirmar)
 * @param enableScrollbars - indica se o conteúdo do modal, ao ultrapassar as dimensões, devem ser exibidas barras de rolagem (defaul = false)
 * @param handleSave - função a ser executada ao clicar no botão de confirmar
 */
function Modal({
  title,
  type,
  customStyle,
  show,
  close,
  children,
  cancelButtonText,
  confirmButtonText,
  showButtons,
  enableScrollbars,
  handleSave
}) {
  let styles = {
    dialogStyles: {
      width: '32%',
      minHeight: '285px',
      position: 'fixed',
      top: '40%',
      left: '60%',
      marginTop: '-10%',
      marginLeft: '-25%',
      borderRadius: '2px',
      zIndex: '100',
      padding: '15px',
      boxShadow:
        'rgba(0, 0, 0, 0.137255) 0px 0px 4px, rgba(0, 0, 0, 0.278431) 0px 4px 8px',
      display: 'block',
      backgroundColor: 'rgb(255, 255, 255)'
    },
    title: {
      fontSize: '2rem'
    }
  };

  if (enableScrollbars === true) {
    styles.dialogStyles.overflow = 'auto';
  }

  let width = window.screen.availWidth;
  switch (type) {
    case 'SMALL':
      styles.dialogStyles.width = width < 1024 ? '45%' : '32%';
      styles.dialogStyles.minHeight = '285px';
      styles.dialogStyles.marginLeft = width < 1024 ? '-31%' : '-25%';
      break;
    case 'MEDIUM':
      styles.dialogStyles.width = width < 1024 ? '50%' : '40%';
      styles.dialogStyles.minHeight = '350px';
      styles.dialogStyles.marginLeft =
        width < 1024 ? '-33%%' : width < 1025 ? '-29%' : '-25%';
      break;
    case 'LARGE':
      styles.dialogStyles.width = '80%';
      styles.dialogStyles.minHeight = '60%';
      styles.dialogStyles.left = '35%';
      break;
    case 'CUSTOM':
      styles.dialogStyles = Object.assign(styles.dialogStyles, customStyle);
      break;
  }

  let buttons = showButtons ? (
    <div className="sv-row sv-horizontal-marged-50">
      <div className="sv-column">
        <button
          className="sv-button link link-danger"
          onClick={close}
          type="button"
        >
          <i className="fa fa-ban" /> {cancelButtonText}
        </button>
        <button
          className="sv-button primary sv-pull-right"
          onClick={handleSave}
          type="button"
        >
          <i aria-hidden="true" className="fa fa-check" /> {confirmButtonText}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <SkyLightStateless
      dialogStyles={styles.dialogStyles}
      isVisible={show}
      onCloseClicked={close}
      onOverlayClicked={close}
      title={title}
      titleStyle={styles.title}
    >
      <hr />

      <div>
        {children}

        {buttons}
      </div>
    </SkyLightStateless>
  );
}

Modal.displayName = 'Modal';

Modal.propTypes = {
  cancelButtonText: PropTypes.string,
  close: PropTypes.func.isRequired,
  confirmButtonText: PropTypes.string,
  customStyle: PropTypes.object,
  enableScrollbars: PropTypes.bool,
  handleSave: PropTypes.func,
  show: PropTypes.bool,
  showButtons: PropTypes.bool,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['SMALL', 'MEDIUM', 'LARGE', 'CUSTOM'])
};

Modal.defaultProps = {
  type: 'SMALL',
  show: false,
  cancelButtonText: 'Cancelar',
  confirmButtonText: 'Salvar',
  showButtons: true,
  enableScrollbars: false
};

export default Modal;
