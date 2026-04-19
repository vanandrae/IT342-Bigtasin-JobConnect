import React, { useState } from 'react';

// Import all icons from assets/icons folder
import briefcase from '../../assets/icons/briefcase.png';
import dashboard from '../../assets/icons/dashboard.png';
import plus from '../../assets/icons/plus.png';
import list from '../../assets/icons/list.png';
import document from '../../assets/icons/document.png';
import star from '../../assets/icons/star.png';
import bell from '../../assets/icons/bell.png';
import setting from '../../assets/icons/setting.png';
import logout from '../../assets/icons/logout.png';
import view from '../../assets/icons/view.png';
import edit from '../../assets/icons/edit.png';
import deleteIcon from '../../assets/icons/delete.png';
import paperPlane from '../../assets/icons/paper-plane.png';
import checked from '../../assets/icons/checked.png';
import close from '../../assets/icons/close.png';
import location from '../../assets/icons/location.png';
import money from '../../assets/icons/money.png';
import building from '../../assets/icons/building.png';
import group from '../../assets/icons/group.png';
import rightArrow from '../../assets/icons/right-arrow.png';
import bookmarkWhite from '../../assets/icons/bookmark-white.png';
// search.png removed - not available

const iconMap = {
  briefcase,
  dashboard,
  plus,
  list,
  document,
  star,
  bell,
  setting,
  logout,
  view,
  edit,
  delete: deleteIcon,
  'paper-plane': paperPlane,
  checked,
  close,
  location,
  money,
  building,
  group,
  'right-arrow': rightArrow,
  'bookmark-white': bookmarkWhite,
};

const Icon = ({ name, className = "w-6 h-6", alt = "", fallback = "" }) => {
  const [hasError, setHasError] = useState(false);
  const iconSrc = iconMap[name];
  
  if (!iconSrc || hasError) {
    // Use fallback emoji or text
    return <span className={className} style={{ fontSize: '1.2em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{fallback || '📁'}</span>;
  }
  
  return (
    <img 
      src={iconSrc} 
      alt={alt || name} 
      className={className}
      style={{ objectFit: 'contain' }}
      onError={() => setHasError(true)}
    />
  );
};

export default Icon;