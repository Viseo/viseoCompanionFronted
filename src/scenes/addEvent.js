/**
 * Created by LMA3606 on 16/02/2017.
 */

import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import locationLogo from '../images/locationLogo.png';
import './addEvent.css';
import 'react-datepicker/dist/react-datepicker.css';
import Event from '../utils/event';
import db from '../utils/db';
import * as util from '../utils/util';
import {Input, Textarea, Button, Option, Container, Row, Col} from 'muicss/react'; //https://www.muicss.com/docs/v1/react

export default class AddEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            errorName: '',
            isNameRequired: true,
            location: '',
            errorLocation: '',
            isLocationRequired: false,
            hours: [],
            time: '',
            isTimeSet: '',
            timeStyle: 'select_notVisited',
            date: '',
            isDateSet: '',
            datepickerStyle: 'datepicker',
            datetime: '',
            keyWords: '',
            description: '',
            errorType: ''
        };
        this.generateSelectHours();
    }

    emptyFields = () => {
        this.setState({
            name: '',
            isNameRequired: false,
            location: '',
            isLocationRequired: false,
            errorLocation: '',
            time: '',
            isTimeSet: '',
            date: '',
            isDateSet: '',
            datetime: '',
            keyWords: '',
            description: '',
            errorName: '',
            errorType: '',
            timeStyle: 'select_notVisited',
        })
    };

    generateSelectHours() {
        const startHour = 8;
        const endHour = 19;

        this.state.hours.push(<Option value="0" label="Horaire" key="Horaire"/>);
        for (let i = startHour; i <= endHour; i++) {
            let hourString = i + ":00";
            this.state.hours.push(<Option value={hourString} label={hourString} key={hourString}/>);
            hourString = i + ":30";
            this.state.hours.push(<Option value={hourString} label={hourString} key={hourString}/>);
        }
    };

    diplaySuccessMessage = () => {
        this.success.style.transition = 'initial';
        this.success.style.opacity = 100;
        setTimeout(() => {
            this.success.style.transition = 'opacity 5s ease-in';
            this.success.style.opacity = 0;
        }, 10);
    };

    isFormCorrect = () => {
        let hasError = '';
        if (this.state.name === '' || this.state.errorName !== '') {
            hasError = " un nom correct";
        }
        if (!this.state.isDateSet) {
            hasError = util.formatMessageWithSlash(hasError, " une date correcte");
        }
        if (!this.state.isTimeSet) {
            hasError = util.formatMessageWithSlash(hasError, " un horaire");
        }
        if (this.state.location === '' || this.state.errorLocation !== '') {
            hasError = util.formatMessageWithSlash(hasError, " un lieu correct");
        }

        if (hasError !== '') {
            this.setState({errorType: 'Veuillez entrer :' + hasError});
            return false;
        } else {
            this.setState({
                datetime: util.getDateTime(this.state.date, this.state.time)
            });
            return true;
        }
    };

    onPressSendNewEvent = async () => {
        if (await this.isFormCorrect()) {
            let newEvent = new Event(null, this.state.name, this.state.description, this.state.datetime, this.state.location, this.state.keyWords)
            if (await db.addEvent(newEvent)) {
                this.emptyFields();
                this.diplaySuccessMessage();
            } else {
                this.setState({errorType: 'Erreur lors de l\'envois au serveur.'});
            }
        }
    };

    handleNameChange = (event) => {
        let inputValue = event.target.value;
        if(inputValue.length <= 30){
            this.setState({
                name: inputValue,
                isNameRequired: true
            });
        }
        let isNameValid = util.isNameValid(inputValue);
        if (isNameValid === -2) {
            this.setState({
                errorName: 'Le nom doit contenir entre 2 et 30 caractères.'
            });
        } else if (!isNameValid) {
            this.setState({
                errorName: 'Le nom doit seulement contenir des caractères alphanumériques et ., -, \', ", /, +, *, #, ?, !'
            });
        } else {
            this.setState({
                errorName: ''
            });
        }
    };

    handleLocationChange = (event) => {
        let inputValue = event.target.value;
        this.setState({
            location: inputValue,
            isLocationRequired: true,
        });
        let isLocationValid = util.isLocationValid(inputValue);
        if (isLocationValid === -2) {
            this.setState({
                errorLocation: 'Le lieu doit contenir au moins deux caractères.'
            });
        } else if (!isLocationValid) {
            this.setState({
                errorLocation: 'Le lieu doit seulement contenir des caractères alphanumériques, tiret ou apostrophe.'
            });
        } else {
            this.setState({
                errorLocation: ''
            });
        }
    };

    handleInputChange = (event) => {
        const stateName = event.target.name;
        const stateValue = event.target.value;

        this.setState({
            [stateName]: stateValue,
        });
    };

    handleDateChange = (date) => {
        if (date) {
            this.setState({
                datepickerStyle:'datepicker',
                date,
                isDateSet: true,
            });
        } else {
            this.setState({
                datepickerStyle:'datepicker_empty',
                isDateSet: false,
            })
        }
    };

    handleTimeChange = (event) => {
        if (parseInt(event.target.value, 10) === 0) {
            this.setState({
                time: '',
                isTimeSet: false,
                timeStyle: 'select_empty'
            });
        } else {
            this.setState({
                time: event.target.value,
                isTimeSet: true,
                timeStyle: 'select_filled',
            });
        }
    };

    renderNameInput() {
        const limit = 30;
        let remainder = limit - this.state.name.length;
        let remainderColor = remainder > 5 ? 'blue' : 'red';
        return (
            <div>
                <Row>
                    <Col md="11">
                        <Input
                            name="name"
                            label="Nom de l'évènement"
                            className="nameInput"
                            value={this.state.name}
                            floatingLabel={true}
                            onChange={this.handleNameChange}
                            onClick={this.handleNameChange}
                            required={this.state.isNameRequired}
                        />
                    </Col>
                    <Col md="1">
                        <div className="remainingLetters" style={{color: remainderColor}}>
                            {remainder}
                        </div>
                    </Col>
                </Row>
                <div className="error errorName">{this.state.errorName}</div>
            </div>
        );
    };

    renderLocationInput() {
        return (
            <div>
                <Row>
                    <Col md="10">
                        <Input
                            name="location"
                            label="Lieu"
                            className="locationInput"
                            value={this.state.location}
                            floatingLabel={true}
                            onChange={this.handleLocationChange}
                            onClick={this.handleLocationChange}
                            required={this.state.isLocationRequired}
                        />
                    </Col>
                    <Col md="2">
                        <div className="locationLogo">
                            <img src={locationLogo} alt="location" style={{width: 26}}/>
                        </div>
                    </Col>
                </Row>
                <div className="error errorLocation">{this.state.errorLocation}</div>
            </div>
        );
    }

    renderDateInput () {
        return (
            <DatePicker
                selected={this.state.date}
                onChange={this.handleDateChange}
                dateFormat={"DD/MM/YYYY"}
                placeholderText="Date"
                todayButton={"Aujourd'hui"}
                minDate={moment()}
                className={this.state.datepickerStyle}
            />
        );
    }

    renderTimeInput() {
        return (
            <select className={this.state.timeStyle} onClick={this.handleTimeChange} onChange={this.handleTimeChange}
                    value={this.state.time}>
                {this.state.hours}
            </select>
        );
    }

    renderDescriptionInput() {
        return (
            <Textarea
                name="description"
                label="Description"
                className="descriptionInput"
                value={this.state.description}
                onChange={this.handleInputChange}
                floatingLabel={true}
            />
        );
    }

    renderKeyWordsInput() {
        return (
            <Textarea
                name="keyWords"
                label="Mots clé"
                className="keyWordsInput"
                value={this.state.keyWords}
                onChange={this.handleInputChange}
                floatingLabel={true}
            />
        );
    }

    render() {
        let nameInput = this.renderNameInput();
        let dateInput = this.renderDateInput();
        let timeInput = this.renderTimeInput();
        let locationInput = this.renderLocationInput();
        let descriptionInput = this.renderDescriptionInput();
        let ketWordsInput = this.renderKeyWordsInput();
        return (
            <div className="new-event-form">
                <h1>Ajouter Evènement</h1>
                <div className="form">
                    <Container>
                        <Row>
                            {nameInput}
                        </Row>
                        <Row>
                            <Col md="8">
                                {dateInput}
                            </Col>
                            <Col md="4">
                                {timeInput}
                            </Col>
                        </Row>
                        <Row>
                            {locationInput}
                        </Row>
                        <Row>
                            {descriptionInput}
                        </Row>
                        <Row>
                            {ketWordsInput}
                        </Row>
                        <Row>
                            <div className="error errorForm">{this.state.errorType}</div>
                            <div
                                className="success"
                                ref={(success) => {
                                    this.success = success;
                                }}
                            >Evènement ajouté !</div>
                        </Row>
                        <Row>
                            <Button
                                variant="flat"
                                color="primary"
                                className="submitButton"
                                onClick={this.onPressSendNewEvent}
                            >
                                Ajouter
                            </Button>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}