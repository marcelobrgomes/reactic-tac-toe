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
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import Game from '../main/Game'

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "../variables/charts.js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [
        {
          title: 'Criar o jogo multiplayer offline',
          description: 'Desenvolver a versão inicial do jogo para multiplayer offline',
          completed: true
        },
        {
          title: 'Implementar single player',
          description: 'Implementação do singleplayer nível fácil, com movimentos randômicos.',
          completed: true
        },
        {
          title: 'Nível normal',
          description: 'Desenvolver lógica para o nível normal, com movimentos de defesa.',
          completed: true
        },
        {
          title: 'Nível Difícil',
          description: 'Implementar o nível difícil, com movimentos de defesa e ataque.',
          completed: true
        },
        {
          title: 'Aplicar tema free',
          description: 'Utilizar um tema free para melhorar o layout geral da aplicação.',
          completed: true
        },
        {
          title: 'Ajustar o jogo ao novo tema',
          description: 'Ajustes gerais de navegação e adaptação do tema para o jogo.',
          completed: true
        },
        {
          title: 'Lista de tarefas dinâmica',
          description: 'Desenvolver a lógica para tornar esta lista de tarefas dinâmica.',
          completed: true
        },
        {
          title: 'Lista de tarefas persistente',
          description: 'Desenvolver a persistência desta lista de tarefas.',
          completed: false
        },
        {
          title: 'Novo nível Difícil',
          description: 'Passar o nível difícil para o médio e desenvolver uma nova lógica para o nível difícil',
          completed: false
        },
        {
          title: 'Placar',
          description: 'Implementar o placar',
          completed: false
        },
        {
          title: 'Animações',
          description: 'Adicionar animações aos botões',
          completed: true
        }
      ]
    };
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col lg="6">
              <Game 
                gameMode={this.props.location.pathname.replace('/admin/','')}
              />
            </Col>
          {/* </Row> */}
          {/* <Row>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Total Shipments</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-bell-55 text-info" />{" "}
                    763,215
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={chartExample2.data}
                      options={chartExample2.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Daily Sales</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                    3,500€
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Bar
                      data={chartExample3.data}
                      options={chartExample3.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Completed Tasks</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-send text-success" /> 12,100K
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={chartExample4.data}
                      options={chartExample4.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>*/}
          
          {/* <Row> */}
            <Col lg="6" md="6">
              <Card className="card-tasks">
                <CardHeader>
                  <h6 className="title d-inline">Tarefas({this.state.tasks.length})</h6>
                  {/* <p className="card-category d-inline"> today</p> */}
                  {/* <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      className="btn-icon"
                      color="link"
                      data-toggle="dropdown"
                      type="button"
                    >
                      <i className="tim-icons icon-settings-gear-63" />
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Another action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Something else
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown> */}
                </CardHeader>
                <CardBody>
                  <div className="table-full-width table-responsive">
                    <Table>
                      <tbody>
                        {this.state.tasks.reverse().map(task => { 
                          return (
                            <tr>
                              <td>
                                <FormGroup check>
                                  <Label check>
                                      {task.completed ? 
                                        <Input defaultChecked defaultValue="" type="checkbox" /> : 
                                        <Input defaultValue="" type="checkbox" />
                                      }
                                      
                                    <span className="form-check-sign">
                                      <span className="check" />
                                    </span>
                                  </Label>
                                </FormGroup>
                              </td>
                              <td>
                                <p className={`title ${task.completed ? 'striked' : ''}`}>{task.title}</p>
                                <p className={`text-muted ${task.completed ? 'striked' : ''}`}>
                                  {task.description}
                                </p>
                              </td>
                              <td className="td-actions text-right">
                                <Button
                                  color="link"
                                  id="tooltip457194718"
                                  title=""
                                  type="button"
                                >
                                  <i className="tim-icons icon-pencil" />
                                </Button>
                                <UncontrolledTooltip
                                  delay={0}
                                  target="tooltip457194718"
                                  placement="right"
                                >
                                  Editar
                                </UncontrolledTooltip>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>{/*
            <Col lg="6" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Simple Table</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>City</th>
                        <th className="text-center">Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Dakota Rice</td>
                        <td>Niger</td>
                        <td>Oud-Turnhout</td>
                        <td className="text-center">$36,738</td>
                      </tr>
                      <tr>
                        <td>Minerva Hooper</td>
                        <td>Curaçao</td>
                        <td>Sinaai-Waas</td>
                        <td className="text-center">$23,789</td>
                      </tr>
                      <tr>
                        <td>Sage Rodriguez</td>
                        <td>Netherlands</td>
                        <td>Baileux</td>
                        <td className="text-center">$56,142</td>
                      </tr>
                      <tr>
                        <td>Philip Chaney</td>
                        <td>Korea, South</td>
                        <td>Overland Park</td>
                        <td className="text-center">$38,735</td>
                      </tr>
                      <tr>
                        <td>Doris Greene</td>
                        <td>Malawi</td>
                        <td>Feldkirchen in Kärnten</td>
                        <td className="text-center">$63,542</td>
                      </tr>
                      <tr>
                        <td>Mason Porter</td>
                        <td>Chile</td>
                        <td>Gloucester</td>
                        <td className="text-center">$78,615</td>
                      </tr>
                      <tr>
                        <td>Jon Porter</td>
                        <td>Portugal</td>
                        <td>Gloucester</td>
                        <td className="text-center">$98,615</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>*/}
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
