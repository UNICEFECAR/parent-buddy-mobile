import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { MilestoneForm } from './MilestoneForm';

const dummyHtml = `
        <section>
            <h2>ASDASD</h2>
            <br />
            <p>SADASDASDASDASDASDASDASDASD</p>
            <br />
            <br />
            <p>SDASDASDASDASD</p>
        </section>
    `

const dummyData = [
    { checked: false, html: dummyHtml, title: "Opušta se kada ga uzmete u naručje", id: 1 },
    { checked: true, html: dummyHtml, title: "Uzbudi se kada mu nešto govorite, uspori pokrete, sluša, prisustvuje", id: 2 },
    { checked: false, html: dummyHtml, title: "Gleda vas dok mu se smešite i pričate", id: 3 },
    { checked: true, html: dummyHtml, title: "Oglašava se", id: 4 },
]



storiesOf('MilestoneForm', module)
    .add('default', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <MilestoneForm
                title="Sposobnosti i veštine iz ovog perioda koje dete treba da osvoji:"
                items={dummyData}
                onPress={(id: number) => onPres(id)}
                roundedButton={{ title: 'Sačuvajte podatke', onPress: onPres }}
            />
        </View>
    ));