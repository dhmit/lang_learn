import React from 'react';

import { Navbar, Footer } from '../UILibrary/components';

export class AboutView extends React.Component {
    render() {
        return (<React.Fragment>
            <Navbar color='light' />
            <div className="page about">
                <h1>About</h1>
                <p>
                    Emerging Technologies for Language Learning was a project by the <a href = "https://digitalhumanities.mit.edu/">MIT Programs in Digital Humanities</a> in collaboration with our Spring 2021 Faculty Fellow, <a href = "https://languages.mit.edu/people/takako-aikawa/">Takako Aikawa</a>, Senior Lecturer in Japanese in Global Languages. The goal of this project was to create a web application for remote language teaching to be used at MIT and beyond. All code created for this project is available on <a href = "https://github.com/dhmit/lang_learn">Github</a>.
                </p>
                <h2>Project Citation</h2>
                <p>
                    Takako Aikawa, Adanna Abraham-Igwe, Tolulope (Tolu) Akinbo, Shara Bhuiyan, Tony Cui, Joshua Feliciano, Peihua Huang, Nicole Khaimov, Ning-Er Lei, Jason Lin, Jackie Lin, Lydia Patterson, Justice Vidal, Yifan Wang, Jordan Wilke, Funing Yang, Samantha York, Montserrat Garza, Vicky Zheng, Angelica Castillejos, Raxel Gutierrez, “Emerging Technologies for Language Learning,” Web resource. 2021. https://langlearn.dhlab.mit.edu/
                </p>
            </div>
            <Footer />
        </React.Fragment>);
    }
}

