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
  constructor (props) {
    super(props)
    const {min, max, value} = props
    let defaultValue = 0
    if (value < min) {
      defaultValue = min
    } else if (value > max) {
      defaultValue = max
    } else {
      defaultValue = value
    }
    this.state = {
      value: defaultValue
    }
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
  public addDocumentTouchEvents ():void {
    this.onTouchMoveListener = addEventListener(this.document, 'touchmove', this.onTouchMove)
    this.onTouchEndListener = addEventListener(this.document, 'touchend', this.onTouchEnd)
  }
  public removeDocumentEvents ():void {
    this.onTouchMoveListener && this.onTouchMoveListener.remove()
    this.onTouchEndListener && this.onTouchEndListener.remove()
  }
  public onTouchMove = (event: any):void => {
    if (this.isNotTouchEvent(event) || !this.sliderRef) {
      return
    }
    const position = this.getTouchPosition(event)
    this.onMove(event, position - this.dragOffset)
  }
  public onMove (event: any, position:number):void {
    event.stopPropagation()
    event.preventDefault()
    console.log('position ===============', position)
    const value = this.calcValueByPos(position)
    if (this.state.value !== value) {
      this.setState({value: Math.ceil(value)})
    } else {
      return
    }
  }
  public getSliderStart ():number {
    const slider = this.sliderRef;
    const rect = slider.getBoundingClientRect();
    console.log('slider=======left', rect.left)
    return rect.left;
  }
  public getSliderLength ():number {
    const slider = this.sliderRef
      if (!slider) {
        return 0
      }

      const coords = slider.getBoundingClientRect()
      console.log('coords.with ===============', coords.width)
      return coords.width
  }
  public calcValue (offset:number):number {
    const {min, max} = this.props
    let ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength())
    ratio = Math.min(ratio, 1)
    const value = ratio > 1 ? ((max - min) + min) : (ratio * (max - min) + min)
    return value
  }
  public calcValueByPos (position:number):number {
    const pixelOffset = position - this.getSliderStart()
    const nextValue = this.calcValue(pixelOffset)
    return nextValue
  }
  public calcOffset (value:number):number {
    const {min, max} = this.props
    const ratio = (value - min) / (max - min)
    return ratio * 100
  }
  public onTouchEnd = ():void=> {
    this.removeDocumentEvents()
  }
  public componentDidMount ():void {
    this.document = this.sliderRef && this.sliderRef.ownerDocument
  }
  render (): React.Element {
    console.log(this.state.value)
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
