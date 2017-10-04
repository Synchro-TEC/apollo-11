import React from 'react';
import PropTypes from 'prop-types';
import { SkyLightStateless } from 'react-skylight';

const DEFAULT_HEADER_HEIGHT = 43;
const BUTTONS_AREA_HEIGHT = 37;
const MODAL_VERTICAL_PADDING = 30;
const SPACE = 10;

/**
 * Encapsula a lógica de montagem de modal.
 *
 * @param buttonsTheme - Tema dos botões de ação
 * @param cancelButtonText - texto do botão que cancela a operação (fecha o modal)
 * @param children - conteúdo a ser renderizado no modal
 * @param closeOnEsc - Fecha o modal ao clicar pressionar ESC
 * @param confirmButtonText - texto do botão de sucesso
 * @param customHeightInPixels - Altura do Modal em pixels
 * @param customStyle - para modais do tipo CUSTOM, este atributo contém um objeto com as propriedades de estilo a serem aplicadas
 * @param customWidthPercent - Largura em porcentagem da janela do Modal
 * @param isVisible - indica se deve ser exibido
 * @param onClose - função a ser executada ao clicar no botão de fechar o modal
 * @param onConfirm - função a ser executada ao clicar no botão de confirmar
 * @param showButtons - indica se devem ser exibidos botões (cancelar e confirmar)
 * @param title - título do modal
 * @param transitionDuration - Duração da animação
 * @param type - tipo do modal. Valores aceitos: 'SMALL', 'MEDIUM', 'LARGE', 'CUSTOM'
 */
const Modal = ({
  buttonsTheme,
  cancelButtonText,
  children,
  closeOnEsc,
  confirmButtonText,
  customHeightInPixels,
  customStyle,
  customWidthPercent,
  isVisible,
  onClose,
  onConfirm,
  showButtons,
  title,
  transitionDuration,
  type,
}) => {
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
      zIndex: '1000',
      padding: ' 15px 25px',
      boxShadow: 'rgba(0, 0, 0, 0.137255) 0px 0px 4px, rgba(0, 0, 0, 0.278431) 0px 4px 8px',
      display: 'block',
      backgroundColor: 'rgb(255, 255, 255)',
    },
    title: {
      fontSize: '1.6rem',
      fontWeight: 'normal',
    },
    overlayStyles: {
      zIndex: '999',
    },
  };

  // if (enableScrollbars === true) {
  //   styles.dialogStyles.overflow = 'auto';
  // }

  let width = window.screen.availWidth;
  let contentMaxHeight;

  const calculateContentAreaHeight = height => {
    let contentAreaHeight = height - MODAL_VERTICAL_PADDING - SPACE;

    if (title) {
      contentAreaHeight = contentAreaHeight - DEFAULT_HEADER_HEIGHT;
    }

    if (showButtons) {
      contentAreaHeight = contentAreaHeight - BUTTONS_AREA_HEIGHT;
    }

    return `${contentAreaHeight}px`;
  };

  switch (type) {
    case 'small':
      styles.dialogStyles.width = width < 1024 ? '45%' : '32%';
      styles.dialogStyles.height = '320px';
      styles.dialogStyles.minHeight = '320px';
      styles.dialogStyles.left = width < 1024 ? '55%' : '68%';
      styles.dialogStyles.marginLeft = width < 1024 ? '-27.5%' : '-34%';
      contentMaxHeight = calculateContentAreaHeight(320);
      break;
    case 'medium':
      styles.dialogStyles.width = width < 1024 ? '50%' : '40%';
      styles.dialogStyles.height = '400px';
      styles.dialogStyles.minHeight = '400px';
      styles.dialogStyles.left = width < 1024 ? '50%' : '60%';
      styles.dialogStyles.marginLeft = width < 1024 ? '-25%' : '-30%';
      contentMaxHeight = calculateContentAreaHeight(400);
      break;
    case 'large':
      styles.dialogStyles.width = '80%';
      styles.dialogStyles.height = '550px';
      styles.dialogStyles.minHeight = '550px';
      styles.dialogStyles.left = '20%';
      styles.dialogStyles.top = '30%';
      styles.dialogStyles.marginLeft = '-10%';
      contentMaxHeight = calculateContentAreaHeight(550);
      break;
    case 'custom':
      styles.dialogStyles = Object.assign(styles.dialogStyles, customStyle);
      styles.dialogStyles.height = `${customHeightInPixels}px`;
      styles.dialogStyles.minHeight = `${customHeightInPixels}px`;
      styles.dialogStyles.width = `${customWidthPercent}%`;
      styles.dialogStyles.left = `${100 - customWidthPercent}%`;
      styles.dialogStyles.marginLeft = `-${(100 - customWidthPercent) / 2}%`;
      contentMaxHeight = calculateContentAreaHeight(customHeightInPixels);
      break;
  }

  let buttons = showButtons ? (
    <div
      className="sv-row sv-mb--0"
      style={{
        position: 'absolute',
        bottom: '0px',
        left: '0px',
        right: '0px',
      }}
    >
      <div className="sv-column sv-pv--15">
        <p className="sv-text-right sv-pr--25 sv-pb--5 sv-mb--0">
          <button className={`sv-button out-${buttonsTheme}`} onClick={onClose}>
            {cancelButtonText}
          </button>
          <button className={`sv-button ${buttonsTheme} sv-ml--15`} onClick={onConfirm}>
            {confirmButtonText}
          </button>
        </p>
      </div>
    </div>
  ) : null;

  return (
    <SkyLightStateless
      closeOnEsc={closeOnEsc}
      dialogStyles={styles.dialogStyles}
      isVisible={isVisible}
      onCloseClicked={onClose}
      onOverlayClicked={onClose}
      overlayStyles={styles.overlayStyles}
      title={title}
      titleStyle={styles.title}
      transitionDuration={transitionDuration}
    >
      <div>
        <div style={{ overflow: 'auto', maxHeight: contentMaxHeight }}>{children}</div>
        {buttons}
      </div>
    </SkyLightStateless>
  );
};

Modal.displayName = 'Modal';

function validateCustomWidth(props, propName, componentName) {
  if (props.type === 'custom') {
    if (!/^\d+$/.test(props[propName]) || (props[propName] < 10 || props[propName] > 90)) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. 
        Validation failed. If your modal is "custom" you need define a number prop named ${propName} between 10 - 90`
      );
    }
  }
}

function validateCustomHeight(props, propName, componentName) {
  if (props.type === 'custom') {
    const minimal = 25;
    let minimalHeight = minimal + MODAL_VERTICAL_PADDING + SPACE;
    if (props.title) {
      minimalHeight += DEFAULT_HEADER_HEIGHT;
    }
    if (props.showButtons) {
      minimalHeight += BUTTONS_AREA_HEIGHT;
    }
    if (!/^\d+$/.test(props[propName]) || props[propName] < minimalHeight) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. 
        Validation failed. If your modal is "custom" you need define a number prop named ${propName} great than ${minimalHeight}`
      );
    }
  }
}

Modal.propTypes = {
  buttonsTheme: PropTypes.oneOf(['primary', 'info', 'danger', 'warning', 'default']),
  cancelButtonText: PropTypes.string,
  children: PropTypes.node,
  closeOnEsc: PropTypes.bool,
  confirmButtonText: PropTypes.string,
  customHeightInPixels: validateCustomHeight,
  customStyle: PropTypes.object,
  customWidthPercent: validateCustomWidth,
  enableScrollbars: PropTypes.bool,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  showButtons: PropTypes.bool,
  title: PropTypes.any,
  transitionDuration: PropTypes.number,
  type: PropTypes.oneOf(['small', 'medium', 'large', 'custom']),
};

Modal.defaultProps = {
  buttonsTheme: 'info',
  cancelButtonText: 'Cancelar',
  closeOnEsc: true,
  confirmButtonText: 'Confirmar',
  enableScrollbars: false,
  show: false,
  showButtons: true,
  transitionDuration: 180,
  type: 'medium',
};

export default Modal;
