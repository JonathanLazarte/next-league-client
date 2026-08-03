import { useRef, cloneElement } from 'react'

export default function TooltipTrigger({ children }) {
  const ref = useRef(null)

  const onClick = () => {
    console.log("hola")
  }

  return cloneElement(children, {
    ref,
    onClick
  })
}
