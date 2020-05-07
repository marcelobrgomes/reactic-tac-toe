import React, {useState} from 'react'
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBaby, faHiking, faUserNinja } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup} from "reactstrap";
import {LOCAL_SINGLEPLAYER_GAME} from '../../Constants'

export default (props) => {
    return (
        <ButtonGroup
            className="btn-group-toggle float-right"
            data-toggle="buttons"
            >
            <Button
                tag="label"
                className={classNames("btn-simple", {
                active: props.level === "easy"
                })}
                color="info"
                id="0"
                size="sm"
                onClick={() => { props.restart(LOCAL_SINGLEPLAYER_GAME); props.setLevel('easy')}}
            >
                <input
                defaultChecked
                className="d-none"
                name="options"
                type="radio"
                />
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                Fácil
                </span>
                <span className="d-block d-sm-none">
                <FontAwesomeIcon icon={faBaby} />
                </span>
            </Button>
            <Button
                color="info"
                id="1"
                size="sm"
                tag="label"
                className={classNames("btn-simple", {
                active: props.level === "normal"
                })}
                onClick={() => { props.restart(LOCAL_SINGLEPLAYER_GAME); props.setLevel('normal')}}
            >
                <input
                className="d-none"
                name="options"
                type="radio"
                />
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                Normal
                </span>
                <span className="d-block d-sm-none">
                <FontAwesomeIcon icon={faHiking} />
                </span>
            </Button>
            <Button
                color="info"
                id="2"
                size="sm"
                tag="label"
                className={classNames("btn-simple", {
                active: props.level === "hard"
                })}
                onClick={() => { props.restart(LOCAL_SINGLEPLAYER_GAME); props.setLevel('hard') }}
            >
                <input
                className="d-none"
                name="options"
                type="radio"
                />
                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                Difícil
                </span>
                <span className="d-block d-sm-none">
                <FontAwesomeIcon icon={faUserNinja} />
                </span>
            </Button>
            </ButtonGroup>
    )
}