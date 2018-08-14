import classnames from 'classnames'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import addEventListener from 'rc-util/lib/Dom/addEventListener'
import './Slider.css'

interface ISliderProps {
  disabled?: boolean,
  value?: number,
  min?: number,
  max?: number,
  onChange?: (value:number) => (void),
  step?: number
}

function noop () {}

class Slider extends React.PureComponent<ISliderProps> {
  // public isEventFromHandle (event: any, handles: any):boolean {
  //   return Object.keys(handles).some(key => {
  //     return event.target === ReactDOM.findDOMNode(handles[key])
  //   })
  // }
  state = {
    value: this.props.value
  }
  public isNotTouchEvent (event: any):boolean {
    return event.touches.length > 1 || (event.type.toLowerCase() === 'touchend' && event.touches.length > 0)
  }
  public getTouchPosition (event: any):number {
    return event.touches[0].pageX
  }
  public getHandleCenterPosition (handle:any):number {
    const coords = handle.getBoundingClientRect()
    return coords.left + (coords.width * .5)
  }
  public touchStartHandle = (event: any):void => {
    event.stopPropagation()
    event.preventDefault()
    if (this.isNotTouchEvent(event)) {
      return
    }
    let position = this.getTouchPosition(event)
    const handlePosition = this.getHandleCenterPosition(event.target)
    this.dragOffset = position - handlePosition
    position = handlePosition
    // this.onStart(position)
    this.addDocumentTouchEvents()
  }
  calcValueByPos (position:number):number {

  }

  public onStart (position: number):void {

  }
  public addDocumentTouchEvents ():void {
    this.onTouchMoveListener = addEventListener(this.document, 'touchmove', this.onTouchMove)
    this.onTouchEndListener = addEventListener(this.document, 'touchend', this.onTouchEnd)
  }
  public removeDocumentEvents ():void {
    this.onTouchMoveListener && this.onTouchMoveListener.remove()
    this.onTouchEndListener && this.onTouchEndListener.remove()
  }
  onTouchMove = (event):void => {
    if (this.isNotTouchEvent(event) || !this.sliderRef) {
      return
    }
    const position = this.getTouchPosition(event)
    this.onMove(event, position - this.dragOffset)
  }
  onMove (event, position) {
    event.stopPropagation()
    event.preventDefault()
    const value = this.calcValueByPos(position)
    this.setState({value})
  }
  getSliderStart () {
    const slider = this.sliderRef;
    const rect = slider.getBoundingClientRect();

    return rect.left;
  }
  getSliderLength () {
    const slider = this.sliderRef
      if (!slider) {
        return 0
      }

      const coords = slider.getBoundingClientRect()
      return coords.width
  }
  calcValue (offset) {
    const {min, max} = this.props
    const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength())
    const value = ratio * (max - min) + min
    return value
  }
  calcValueByPos (position) {
    const pixelOffset = position - this.getSliderStart()
    const nextValue = this.calcValue(pixelOffset)
    return nextValue
  }
  calcOffset (value:number):number {
    const {min, max} = this.props
    const ratio = (value - min) / (max - min)
    return ratio * 100
  }
  onTouchEnd = ():void=> {
    this.removeDocumentEvents()
  }
  componentDidUpdate () {
    console.log('cccccc')
  }
  public componentDidMount ():void {
    this.document = this.sliderRef && this.sliderRef.ownerDocument
  }
  render (): React.Element {
    const {disabled} = this.props
    const offset = this.calcOffset(this.state.value)
    return (
      <div className={
        classnames('xerxes-slider')
      }
      ref={(ref) => this.sliderRef = ref}
      onTouchStart={disabled ? noop : this.touchStartHandle}
      onMouseDown={disabled ? noop : this.mouseDownHandle}
      >
        <div className="xerxes-slider__bg" />
        <div className="xerxes-slider__progress" 
        style={{width: `${offset}%`}}
        />
        <div className="xerxes-slider__handle"
        style={{left: `${offset}%`}}
        ref={ref => this.handleRef = ref}
        />
        <div className="xerxes-slider__mask" />
      </div>
    )
  }
}

Slider.defaultProps = {
  max: 100,
  min: 0,
  step: 1,
  value: 0
}

export default Slider
