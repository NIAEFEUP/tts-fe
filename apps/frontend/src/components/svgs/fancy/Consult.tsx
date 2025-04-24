const ConsultIcon = () => {
  return (
    <svg className="h-11 w-11 flex-none overflow-visible" fill="none">
      <defs>
        <filter
          id="step-icon-0"
          x="-3"
          y="-1"
          width="50"
          height="50"
          filterUnits="userSpaceOnUse"
          colorinterpolationfilters-filters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          ></feColorMatrix>
          <feOffset dy="2"></feOffset>
          <feGaussianBlur stdDeviation="2.5"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0.054902 0 0 0 0 0.647059 0 0 0 0 0.913725 0 0 0 0.12 0"></feColorMatrix>
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_804_95228"></feBlend>
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_804_95228" result="shape"></feBlend>
        </filter>
      </defs>
      <g filter="url(#step-icon-0)">
        <path
          d="M2.75 10A7.25 7.25 0 0 1 10 2.75h24A7.25 7.25 0 0 1 41.25 10v24A7.25 7.25 0 0 1 34 41.25H10A7.25 7.25 0 0 1 2.75 34V10Z"
          fill="#fbf5f5"
        ></path>
        <path
          d="M2.75 10A7.25 7.25 0 0 1 10 2.75h24A7.25 7.25 0 0 1 41.25 10v24A7.25 7.25 0 0 1 34 41.25H10A7.25 7.25 0 0 1 2.75 34V10Z"
          stroke="#b33636"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
      <path
        d="M11.75 8.75h12.5a3 3 0 0 1 3 3v20.5a3 3 0 0 1-3 3h-12.5a3 3 0 0 1-3-3v-20.5a3 3 0 0 1 3-3Z"
        fill="#fff"
        stroke="#b33636"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        opacity=".4"
        d="M29.75 35.25h2.5a3 3 0 0 0 3-3v-20.5a3 3 0 0 0-3-3h-20.5a3 3 0 0 0-3 3v7.5"
        stroke="#b33636"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path d="M30.25 19.75v4.5" stroke="#b33636" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
}

export default ConsultIcon
