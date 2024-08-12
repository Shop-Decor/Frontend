import React from 'react';
import "../../styles/user/about.scss";
class About extends React.Component {
    render() {
        return (
            <>
                <div class="container about-me">
                    <h2 class="font-weight-bold">
                        Contact Us
                    </h2>
                    <div class="row">
                        <div>
                            <form action="">
                                <div class="contact_form-container">
                                    <div>
                                        <div>
                                            <input type="text" placeholder="Name" />
                                        </div>
                                        <div>
                                            <input type="text" placeholder="Phone Number" />
                                        </div>
                                        <div>
                                            <input type="email" placeholder="Email" />
                                        </div>

                                        <div class="mt-5">
                                            <input type="text" placeholder="Message" />
                                        </div>
                                        <div class="mt-5">
                                            <button type="submit">
                                                send
                                            </button>
                                        </div>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default About;