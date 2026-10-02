const TidyIcon = () => {
  return (
    <svg className="h-11 w-11 flex-none overflow-visible" fill="none">
      <defs>
        <filter
          id="step-icon-2"
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
      <g filter="url(#step-icon-2)">
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 35.25c.69 0 1.25-.56 1.25-1.25A3.75 3.75 0 0 1 28 30.25a1.25 1.25 0 1 0 0-2.5A3.75 3.75 0 0 1 24.25 24a1.25 1.25 0 1 0-2.5 0A3.75 3.75 0 0 1 18 27.75a1.25 1.25 0 0 0 0 2.5A3.75 3.75 0 0 1 21.75 34c0 .69.56 1.25 1.25 1.25Z"
        fill="#fff"
      ></path>
      <path
        d="M28 27a.75.75 0 0 0 0 1.5V27Zm-4.5 7a.5.5 0 0 1-.5.5V36a2 2 0 0 0 2-2h-1.5Zm5-5a.5.5 0 0 1-.5.5V31a2 2 0 0 0 2-2h-1.5Zm-.5-.5a.5.5 0 0 1 .5.5H30a2 2 0 0 0-2-2v1.5Zm-5-5a.5.5 0 0 1 .5.5H25a2 2 0 0 0-2-2v1.5Zm-.5.5a.5.5 0 0 1 .5-.5V22a2 2 0 0 0-2 2h1.5Zm-5 5a.5.5 0 0 1 .5-.5V27a2 2 0 0 0-2 2h1.5Zm.5.5a.5.5 0 0 1-.5-.5H16a2 2 0 0 0 2 2v-1.5Zm5 5a.5.5 0 0 1-.5-.5H21a2 2 0 0 0 2 2v-1.5ZM18 31a3 3 0 0 1 3 3h1.5a4.5 4.5 0 0 0-4.5-4.5V31Zm3-7a3 3 0 0 1-3 3v1.5a4.5 4.5 0 0 0 4.5-4.5H21Zm7 3a3 3 0 0 1-3-3h-1.5a4.5 4.5 0 0 0 4.5 4.5V27Zm-3 7a3 3 0 0 1 3-3v-1.5a4.5 4.5 0 0 0-4.5 4.5H25Z"
        fill="#b33636"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 27.25c.69 0 1.25-.56 1.25-1.25 0-.966.784-1.75 1.75-1.75a1.25 1.25 0 1 0 0-2.5A1.75 1.75 0 0 1 14.25 20a1.25 1.25 0 1 0-2.5 0A1.75 1.75 0 0 1 10 21.75a1.25 1.25 0 0 0 0 2.5c.966 0 1.75.784 1.75 1.75 0 .69.56 1.25 1.25 1.25Z"
        fill="#fff"
      ></path>
      <path
        d="M16 21a.75.75 0 0 0 0 1.5V21Zm-2.5 5a.5.5 0 0 1-.5.5V28a2 2 0 0 0 2-2h-1.5Zm3-3a.5.5 0 0 1-.5.5V25a2 2 0 0 0 2-2h-1.5Zm-.5-.5a.5.5 0 0 1 .5.5H18a2 2 0 0 0-2-2v1.5Zm-3-3a.5.5 0 0 1 .5.5H15a2 2 0 0 0-2-2v1.5Zm-.5.5a.5.5 0 0 1 .5-.5V18a2 2 0 0 0-2 2h1.5Zm-3 3a.5.5 0 0 1 .5-.5V21a2 2 0 0 0-2 2h1.5Zm.5.5a.5.5 0 0 1-.5-.5H8a2 2 0 0 0 2 2v-1.5Zm3 3a.5.5 0 0 1-.5-.5H11a2 2 0 0 0 2 2v-1.5ZM10 25a1 1 0 0 1 1 1h1.5a2.5 2.5 0 0 0-2.5-2.5V25Zm1-5a1 1 0 0 1-1 1v1.5a2.5 2.5 0 0 0 2.5-2.5H11Zm5 1a1 1 0 0 1-1-1h-1.5a2.5 2.5 0 0 0 2.5 2.5V21Zm-1 5a1 1 0 0 1 1-1v-1.5a2.5 2.5 0 0 0-2.5 2.5H15Z"
        fill="#b33636"
      ></path>
      <path
        opacity=".4"
        d="M29.75 35.25h2.5a3 3 0 0 0 3-3v-20.5a3 3 0 0 0-3-3h-20.5a3 3 0 0 0-3 3v5.5M12.75 14.25h18.5"
        stroke="#b33636"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  )
}

export default TidyIcon
