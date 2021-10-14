import React from 'react';

import './chrome-tabs.css';

const Tab = ({ index }) => {
  const x = index * 239;

  return (
    <div
      className="chrome-tab"
      style={{
        transform: `translate3d(${x}px, 0, 0)`,
      }}
    >
      <div className="chrome-tab-dividers"></div>
      <div className="chrome-tab-background">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36">
              <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" />
            </symbol>
            <symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36">
              <use href="#chrome-tab-geometry-left" />
            </symbol>
            <clipPath id="crop">
              <rect className="mask" width="100%" height="100%" x="0" />
            </clipPath>
          </defs>
          <svg width="52%" height="100%">
            <use
              href="#chrome-tab-geometry-left"
              width="214"
              height="36"
              className="chrome-tab-geometry"
            />
          </svg>
          <g transform="scale(-1, 1)">
            <svg width="52%" height="100%" x="-100%" y="0">
              <use
                href="#chrome-tab-geometry-right"
                width="214"
                height="36"
                className="chrome-tab-geometry"
              />
            </svg>
          </g>
        </svg>
      </div>

      
      <div className="chrome-tab-content">
        <div className="chrome-tab-favicon"></div>
        <div className="chrome-tab-title">asdasdasdas</div>
        <div className="chrome-tab-drag-handle"></div>
        <div className="chrome-tab-close"></div>
      </div>
    </div>
  );
}

export default Tab;