import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Slider from './Slider'

const App = ():React.Element => (
  <div>
    hello world1
    <div style={{width: '200px', margin: '50px'}}>
      <Slider />
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)

