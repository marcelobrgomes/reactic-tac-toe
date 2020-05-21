import React from 'react'
import './Gameboard.css'
import GameButton from '../GameButton/GameButton'
import LevelSwitch from './LevelSwitch'

import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardFooter
  } from "reactstrap";

export default props => {
    return (
        <React.Fragment>
            <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                        <CardTitle tag="h4">{props.message}&nbsp;</CardTitle>
                    </Col>
                    {props.showLevelSwitch ? 
                        <Col sm="6">
                            <LevelSwitch 
                                level={props.level} 
                                setLevel={props.setLevel}
                                restart={props.restart}
                            />
                        </Col>
                    : 
                        null}
                  </Row>
                </CardHeader>
                <CardBody>
                    <div className={`board animated`}>
                        <div></div>
                        <GameButton id="0" key={0} play={props.userPlay} value={props.gameArray[0]}/>
                        <GameButton id="1" key={1} play={props.userPlay} value={props.gameArray[1]}/>
                        <GameButton id="2" key={2} play={props.userPlay} value={props.gameArray[2]} className="top-right"/>
                        <div></div>
                        <div></div>
                        <GameButton id="3" key={3} play={props.userPlay} value={props.gameArray[3]}/>
                        <GameButton id="4" key={4} play={props.userPlay} value={props.gameArray[4]}/>
                        <GameButton id="5" key={5} play={props.userPlay} value={props.gameArray[5]} className="middle-right"/>
                        <div></div>
                        <div></div>
                        <GameButton id="6" key={6} play={props.userPlay} value={props.gameArray[6]} className="bottom-left"/>
                        <GameButton id="7" key={7} play={props.userPlay} value={props.gameArray[7]} className="bottom-middle"/>
                        <GameButton id="8" key={8} play={props.userPlay} value={props.gameArray[8]} className="bottom-right"/>
                        <div></div>
                    </div>
                </CardBody>
                <CardFooter>
                    <div className="board-footer">
                        <CardTitle tag="h4">{`Jogador X: ${props.xCount}`}</CardTitle>
                        <CardTitle tag="h4">{`Jogador O: ${props.oCount}`}</CardTitle>
                        {/* <span><h5 className="card-category">Zerar o Placar</h5></span> */}
                    </div>
                </CardFooter>
              </Card>
        </React.Fragment>
    )
}