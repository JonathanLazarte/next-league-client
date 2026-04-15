import './userTooltip.css'

export const ToolTip = ({ hoveredUser : dataToRender, tooltipPos }) => {
    const RESOURCES_URL = '/' || 'https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/'
    const style = {
          position:"fixed",
          right: window.innerWidth * 0.18,
          top: tooltipPos.y - window.innerWidth * 0.09 - window.innerWidth * 0.015,
          //width: windowPosition.width,
          display: `${dataToRender ? 'flex' : 'none'}`, 
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url('${RESOURCES_URL}centered/${dataToRender?.background}.jpg')`
    }
      return (
          <div className="right-nav-user-tooltip" style={style}>
              <div className="tooltip-user-container">
                  <div className="tooltip-user-level">
                      <img src={`${RESOURCES_URL}general/7201_Precision.png`}/><h3>24</h3>
                  </div>
                  <div className="tooltip-user-info">
                      <div className="tooltip-user-icon">
                          <img className="tooltip-user-border" src={`${RESOURCES_URL}general/EoG_Border_150_4k.png`}/>
                          <img className="tooltip-user-icon-img" src={`${RESOURCES_URL}profileicon/${dataToRender?.profileIcon}.png`}></img>
                      </div>
                      <div className="tooltip-user-info-text">
                          <h4>{dataToRender?.userName}</h4>
                          <h6 className="subname">#{dataToRender?.tag}</h6>
                          <span className="user-title">{dataToRender?.title}</span>
                          <div className="separator"/>
                          <span className="rank-and-points">{dataToRender?.rank?.name} ({dataToRender?.rank?.points} pts)</span>
                      </div>

                  </div>
                  <div className="tooltip-user-status">
                      <div className="user-status"><div style={{width: "10px", height: "10px"}} className="status-icon"></div> En linea </div>
                  </div>                
              </div>
          </div>
      )
    /*const handleToolTip = (e, data) => {
      if (timeoutId){
          clearTimeout(timeoutId);
        }
        const nuevoTimeOutId = setTimeout(()=>{
        const elemento = e.target;
        const rect = elemento.getBoundingClientRect();

        setWindowPosition({ x: rect.left, y: rect.top + rect.height + 20, width: rect.width, height: rect.height })
        setDataToRender(data)
        setShowWindow(true)
      },550)
      setTimeoutId(nuevoTimeOutId)    
    }
    const offToolTip = () => {
      setShowWindow(false)
      if (timeoutId) {
          clearTimeout(timeoutId); // Cancelar el timeout si el mouse sale
          setTimeoutId(null); // Limpiar el ID del timeout
        }
    }*/
}

export default ToolTip