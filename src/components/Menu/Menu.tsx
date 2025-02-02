import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Children, HTMLProps, ReactNode, Ref } from 'react';

import { useTypeaheadContext } from '../../core/Context';

import { BaseMenuItem } from '../MenuItem';

import { preventInputBlur } from '../../utils';
import { checkPropType, isRequiredForA11y } from '../../propTypes';

const MenuDivider = () => <div className="dropdown-divider" role="separator" />;

const MenuHeader = (props: HTMLProps<HTMLDivElement>) => (
  // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
  <div {...props} className="dropdown-header" role="heading" />
);

const propTypes = {
  'aria-label': PropTypes.string,
  /**
   * Message to display in the menu if there are no valid results.
   */
  emptyLabel: PropTypes.node,
  /**
   * Needed for accessibility.
   */
  id: checkPropType(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isRequiredForA11y
  ),
  /**
   * Maximum height of the dropdown menu.
   */
  maxHeight: PropTypes.string,
};

export interface MenuProps extends HTMLProps<HTMLDivElement> {
  emptyLabel?: ReactNode;
  innerRef?: Ref<HTMLDivElement>;
  maxHeight?: string;
  multiple?: boolean;
}

/**
 * Menu component that handles empty state when passed a set of results.
 */
const Menu = ({
  emptyLabel = 'No matches found.',
  innerRef,
  maxHeight = '300px',
  style,
  ...props
}: MenuProps) => {
  const children =
    Children.count(props.children) === 0 ? (
      <BaseMenuItem disabled role="option">
        {emptyLabel}
      </BaseMenuItem>
    ) : (
      props.children
    );

  const { onSelectAllClick } = useTypeaheadContext();

  return (
    /* eslint-disable jsx-a11y/interactive-supports-focus */
    <div
      {...props}
      aria-label={props['aria-label'] || 'menu-options'}
      className={cx('rbt-menu', 'dropdown-menu', 'show', props.className)}
      onMouseDown={
        // Prevent input from blurring when clicking on the menu scrollbar.
        preventInputBlur
      }
      ref={innerRef}
      role="listbox"
      style={{
        ...style,
        display: 'block',
        maxHeight,
        overflow: 'auto',
      }}>
        {props.multiple && <button type='button' className={cx('dropdown-item')} onClick={() => onSelectAllClick() }>Select All</button>}
      {children}
    </div>
    /* eslint-enable jsx-a11y/interactive-supports-focus */
  );
};

Menu.propTypes = propTypes;
Menu.Divider = MenuDivider;
Menu.Header = MenuHeader;

export default Menu;
