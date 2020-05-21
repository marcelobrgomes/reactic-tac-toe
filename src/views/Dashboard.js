/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import Gameboard from '../components/Gameboard/Gameboard'

// reactstrap components
import {Row, Col} from "reactstrap";

import ProjectTasks from "../components/ProjectTasks/ProjectTasks";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col lg="6">
              <Gameboard 
                gameMode={this.props.location.pathname.replace('/admin/','')}
              />
            </Col>
            <Col lg="6" md="6">
              <ProjectTasks />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
