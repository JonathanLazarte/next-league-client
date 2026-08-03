import "./LoadingOverlay.css";

export default function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-wrapper">
        <svg
          className="loading-svg"
          id="Capa_2"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 135 135"
        >
          <defs>
            {/*<style>
                .cls-1 {
                  stroke-dasharray: 1.99 6.95;
                }

                .cls-1, .cls-2 {
                  fill: none;
                  stroke: #000;
                  stroke-miterlimit: 10;
                  stroke-width: 7px;
                }
              </style>*/}
          </defs>
          <g id="Lines">
            <g>
              <path className="loading-2" d="M67.5,131.5c-.33,0-.67,0-1,0" />
              <path
                className="loading-1"
                d="M59.57,131.01c-31.6-3.91-56.07-30.85-56.07-63.51C3.5,32.15,32.15,3.5,67.5,3.5s64,28.65,64,64-26.27,61.56-59.54,63.85"
              />
              <path className="loading-2" d="M68.5,131.49c-.33,0-.67,0-1,0" />
            </g>
          </g>
        </svg>
        <div className="loading-square-wrapper">
          <div className="loading-square"></div>
        </div>
        {/* <p className="loading-text">Loading, please wait.</p>*/}
      </div>
    </div>
  );
}
