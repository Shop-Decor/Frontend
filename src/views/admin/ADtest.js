import React from 'react';

class ADtest extends React.Component {
    state = {
        imgFiles: [],
        imgUrl: [],
        imgPreviews: [],
        product: {
            img: []
        }
    }
    render() {
        return (
            <>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-bs-toggle="tab" href="#home">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#menu1">Menu 1</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#menu2">Menu 2</a>
                    </li>
                </ul>

                <div className="tab-content">
                    <div id="home" className="container tab-pane active"><br />
                        <h3>HOME</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                    <div id="menu1" className="container tab-pane fade"><br />
                        <h3>Menu 1</h3>
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    <div id="menu2" className="container tab-pane fade"><br />
                        <h3>Menu 2</h3>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                    </div>
                </div>
            </>
        )
    }
}

export default ADtest;