import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import {MilestoneForm} from './MilestoneForm';

const dumyHtml = `
        <section>
            <h2>ASDASD</h2>
            <br />
            <p>SADASDASDASDASDASDASDASDASD</p>
            <br />
            <br />
            <p>SDASDASDASDASD</p>
        </section>
    `

const dumbyData = [
    {checked: false, html: dumyHtml, title:"Opušta se kada ga uzmete u naručje", },
    {checked: true, html: dumyHtml, title:"Uzbudi se kada mu nešto govorite, uspori pokrete, sluša, prisustvuje"},
    {checked: false, html: dumyHtml, title:"Gleda vas dok mu se smešite i pričate"},
    {checked: true, html: dumyHtml, title:"Oglašava se"},
]

const onPres = () => {}

storiesOf('MilestoneForm', module)
    .add('default', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <MilestoneForm 
                title="Sposobnosti i veštine iz ovog perioda koje dete treba da osvoji:"
                items={dumbyData}
                roundedButton={{title: 'Sačuvajte podatke', onPress: onPres}}
            />
        </View>
    ));