import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
        const emotions = this.props.emotions
        const emotionsHTML = Object.keys(emotions).map(emotion =>
            {
                return(
                    <>
                    <tr>
                    <td>{emotion}</td>
                    <td>{emotions[emotion]}</td>
                    </tr>
                    </>
                )
            })
      return (  
        <div>

          <table className="table table-bordered">
            <tbody>
                {emotionsHTML}
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;
